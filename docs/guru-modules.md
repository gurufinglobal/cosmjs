# Guru 커스텀 모듈 가이드

이 문서는 `guru/x` 하위의 커스텀 모듈들이 `@cosmjs/stargate`에 어떻게 반영되었는지 설명하고 사용법을 안내합니다.

---

## 추가된 모듈 목록

| 모듈 | 패키지 경로 | Tx | Query |
|------|------------|-----|-------|
| bex | `guru.bex.v1` | ✅ | ✅ |
| oracle | `guru.oracle.v1` | ✅ | ✅ |
| feepolicy | `guru.feepolicy.v1` | ✅ | ✅ |
| erc20 | `cosmos.evm.erc20.v1` | ✅ | ✅ |
| evmfeemarket | `cosmos.evm.feemarket.v1` | — | ✅ |

---

## 모듈별 상세

### 1. BEX (`guru.bex.v1`)

토큰 교환(Exchange) 및 관리자 권한을 관리하는 모듈입니다.
moderator/admin 권한에 따라 교환쌍 등록, 수정, 수수료 인출, 제한(ratemeter) 설정을 수행합니다.

#### 타입

```typescript
interface Exchange {
  id: string;                // cosmos.Int
  adminAddress: string;
  reserveAddress: string;
  denomA: string;
  ibcDenomA: string;
  portA: string;
  channelA: string;
  denomB: string;
  ibcDenomB: string;
  portB: string;
  channelB: string;
  fee: string;               // cosmos.Dec
  limit: string;             // LegacyDec
  oracleRequestId: bigint;   // uint64
  status: string;
  metadata: Record<string, string>;
}

interface Ratemeter {
  requestCountLimit: bigint; // uint64
  requestPeriod?: Duration;  // google.protobuf.Duration
}
```

#### Tx 사용법

```typescript
import { SigningStargateClient } from "@cosmjs/stargate";

const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer);

// admin 등록 (moderator 전용)
await client.signAndBroadcast(
  moderatorAddress,
  [
    {
      typeUrl: "/guru.bex.v1.MsgRegisterAdmin",
      value: {
        moderatorAddress,
        adminAddress: "guru1admin...",
        exchangeId: "1", // cosmos.Int -> string
      },
    },
  ],
  "auto",
);

// Exchange 등록 (admin 전용)
await client.signAndBroadcast(
  adminAddress,
  [
    {
      typeUrl: "/guru.bex.v1.MsgRegisterExchange",
      value: {
        adminAddress,
        exchange: {
          id: "1",
          adminAddress,
          reserveAddress: "guru1reserve...",
          denomA: "agxn",
          ibcDenomA: "",
          portA: "transfer",
          channelA: "",
          denomB: "uguru",
          ibcDenomB: "",
          portB: "transfer",
          channelB: "",
          fee: "0.003",
          limit: "1000000",
          oracleRequestId: BigInt(0),
          status: "enabled",
          metadata: { source: "manual" },
        },
      },
    },
  ],
  "auto",
);

// moderator 변경
await client.signAndBroadcast(
  moderatorAddress,
  [
    {
      typeUrl: "/guru.bex.v1.MsgChangeBexModerator",
      value: { moderatorAddress, newModeratorAddress: "guru1newmod..." },
    },
  ],
  "auto",
);
```

#### Query 사용법

```typescript
import { StargateClient } from "@cosmjs/stargate";

const client = await StargateClient.connect(rpcEndpoint);

// moderator 주소
const moderator = await client.forceGetQueryClient().bex.moderatorAddress();

// Exchange 목록 / 단건(id 필터)
const exchanges = await client.forceGetQueryClient().bex.exchanges();
const oneExchange = await client.forceGetQueryClient().bex.exchanges("1");

// admin 여부
const isAdmin = await client.forceGetQueryClient().bex.isAdmin("guru1admin...");

// 다음 exchange id
const nextId = await client.forceGetQueryClient().bex.nextExchangeId();

// ratemeter
const ratemeter = await client.forceGetQueryClient().bex.ratemeter();

// 수수료 조회
const collected = await client.forceGetQueryClient().bex.collectedFees("1");
const locked = await client.forceGetQueryClient().bex.lockedFees("1");
const available = await client.forceGetQueryClient().bex.availableFees("1");
```

---

### 2. Oracle (`guru.oracle.v1`)

온체인 오라클 데이터 피드 모듈입니다. 가격 정보, 환율, 주식 데이터 등 외부 데이터를 체인에 기록합니다.

#### 타입

```typescript
enum OracleType {
  ORACLE_TYPE_UNSPECIFIED = 0,
  ORACLE_TYPE_MIN_GAS_PRICE = 1,  // 최소 가스 가격
  ORACLE_TYPE_CURRENCY = 2,        // 환율
  ORACLE_TYPE_STOCK = 3,           // 주식
  ORACLE_TYPE_CRYPTO = 4,          // 암호화폐
}

enum RequestStatus {
  REQUEST_STATUS_UNSPECIFIED = 0,
  REQUEST_STATUS_ENABLED = 1,
  REQUEST_STATUS_PAUSED = 2,
  REQUEST_STATUS_DISABLED = 3,
}

enum AggregationRule {
  AGGREGATION_RULE_UNSPECIFIED = 0,
  AGGREGATION_RULE_AVG = 1,     // 평균
  AGGREGATION_RULE_MIN = 2,     // 최솟값
  AGGREGATION_RULE_MAX = 3,     // 최댓값
  AGGREGATION_RULE_MEDIAN = 4,  // 중앙값
}

interface OracleRequestDoc {
  requestId: bigint;
  oracleType: OracleType;
  name: string;
  description: string;
  period: number;          // 갱신 주기 (초)
  accountList: string[];   // 데이터 제공 허가 주소 목록
  quorum: number;          // 집계에 필요한 최소 제출 수
  endpoints: OracleEndpoint[];
  aggregationRule: AggregationRule;
  status: RequestStatus;
  nonce: bigint;
}
```

#### Tx 사용법

```typescript
import { SigningStargateClient } from "@cosmjs/stargate";

const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer);

// 오라클 요청 문서 등록 (moderator 전용)
const result = await client.signAndBroadcast(
  moderatorAddress,
  [
    {
      typeUrl: "/guru.oracle.v1.MsgRegisterOracleRequestDoc",
      value: {
        moderatorAddress,
        requestDoc: {
          requestId: BigInt(0), // 체인이 자동 할당
          oracleType: OracleType.ORACLE_TYPE_CRYPTO,
          name: "BTC/USD",
          description: "Bitcoin price in USD",
          period: 60,
          accountList: ["guru1oracle1...", "guru1oracle2..."],
          quorum: 2,
          endpoints: [{ url: "https://api.example.com/btc", parseRule: "$.price" }],
          aggregationRule: AggregationRule.AGGREGATION_RULE_MEDIAN,
          status: RequestStatus.REQUEST_STATUS_ENABLED,
          nonce: BigInt(0),
        },
      },
    },
  ],
  "auto",
);

// 오라클 데이터 제출 (오라클 노드 전용)
const submitResult = await client.signAndBroadcast(
  authorityAddress,
  [
    {
      typeUrl: "/guru.oracle.v1.MsgSubmitOracleData",
      value: {
        authorityAddress,
        dataSet: {
          requestId: BigInt(1),
          nonce: BigInt(42),
          rawData: '{"price": "65000.00"}',
          provider: authorityAddress,
          signature: new Uint8Array(/* 서명 바이트 */),
        },
      },
    },
  ],
  "auto",
);

// moderator 주소 변경
await client.signAndBroadcast(
  moderatorAddress,
  [
    {
      typeUrl: "/guru.oracle.v1.MsgUpdateModeratorAddress",
      value: { moderatorAddress, newModeratorAddress: "guru1newmod..." },
    },
  ],
  "auto",
);
```

#### Query 사용법

```typescript
import { StargateClient } from "@cosmjs/stargate";

const client = await StargateClient.connect(rpcEndpoint);

// 오라클 파라미터 조회
const params = await client.forceGetQueryClient().oracle.params();
console.log(params.enableOracle, params.submitWindow);

// 오라클 요청 문서 단건 조회
const doc = await client.forceGetQueryClient().oracle.oracleRequestDoc(BigInt(1));

// 상태별 오라클 요청 문서 목록 조회
const docs = await client.forceGetQueryClient().oracle.oracleRequestDocs(RequestStatus.REQUEST_STATUS_ENABLED);

// 집계된 오라클 데이터 조회
const data = await client.forceGetQueryClient().oracle.oracleData(BigInt(1));
console.log(data?.rawData); // '{"price": "65000.00"}'

// 특정 제출 데이터 조회
const submitData = await client.forceGetQueryClient().oracle.oracleSubmitData(
  BigInt(1),   // requestId
  BigInt(42),  // nonce
  authorityAddress,
);

// moderator 주소 조회
const moderator = await client.forceGetQueryClient().oracle.moderatorAddress();
```

---

### 3. FeePolicy (`guru.feepolicy.v1`)

계정별 트랜잭션 수수료 할인 정책을 관리하는 모듈입니다. moderator가 특정 계정에 대해 특정 메시지 타입의 수수료를 할인할 수 있습니다.

#### 타입

```typescript
interface Discount {
  discountType: string;  // 할인 유형 식별자
  msgType: string;       // 적용 메시지 타입 (예: "/cosmos.bank.v1beta1.MsgSend")
  amount: string;        // 할인율 (Dec 문자열, 예: "0.1" = 10% 할인)
}

interface ModuleDiscount {
  module: string;           // 모듈 이름
  discounts: Discount[];
}

interface AccountDiscount {
  address: string;           // 할인 대상 계정 주소
  modules: ModuleDiscount[];
}
```

#### Tx 사용법

```typescript
// 할인 등록 (moderator 전용)
await client.signAndBroadcast(
  moderatorAddress,
  [
    {
      typeUrl: "/guru.feepolicy.v1.MsgRegisterDiscounts",
      value: {
        moderatorAddress,
        discounts: [
          {
            address: "guru1user...",
            modules: [
              {
                module: "bank",
                discounts: [
                  {
                    discountType: "vip",
                    msgType: "/cosmos.bank.v1beta1.MsgSend",
                    amount: "0.5", // 50% 할인
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
  "auto",
);

// 할인 제거 (moderator 전용)
await client.signAndBroadcast(
  moderatorAddress,
  [
    {
      typeUrl: "/guru.feepolicy.v1.MsgRemoveDiscounts",
      value: {
        moderatorAddress,
        address: "guru1user...",
        module: "bank",
        msgType: "/cosmos.bank.v1beta1.MsgSend",
      },
    },
  ],
  "auto",
);

// moderator 변경
await client.signAndBroadcast(
  moderatorAddress,
  [
    {
      typeUrl: "/guru.feepolicy.v1.MsgChangeModerator",
      value: { moderatorAddress, newModeratorAddress: "guru1newmod..." },
    },
  ],
  "auto",
);
```

#### Query 사용법

```typescript
// moderator 주소 조회
const moderator = await client.forceGetQueryClient().feepolicy.moderatorAddress();

// 모든 할인 목록 조회 (페이지네이션 지원)
const discounts = await client.forceGetQueryClient().feepolicy.discounts();

// 특정 계정 할인 조회
const discount = await client.forceGetQueryClient().feepolicy.discount("guru1user...");
console.log(discount.modules[0].discounts[0].amount); // "0.5"
```

---

### 4. ERC20 (`cosmos.evm.erc20.v1`)

Cosmos 네이티브 코인과 ERC-20 토큰 간 상호 변환을 지원하는 모듈입니다.

#### 타입

```typescript
enum Owner {
  OWNER_UNSPECIFIED = 0,
  OWNER_MODULE = 1,    // erc20 모듈 소유
  OWNER_EXTERNAL = 2,  // 외부 계정 소유
}

interface TokenPair {
  erc20Address: string;    // ERC-20 컨트랙트 주소 (hex)
  denom: string;           // Cosmos 코인 denomination
  enabled: boolean;        // 변환 활성화 여부
  contractOwner: Owner;
}
```

#### Tx 사용법

```typescript
// ERC-20 → Cosmos 코인 변환
await client.signAndBroadcast(
  senderAddress,
  [
    {
      typeUrl: "/cosmos.evm.erc20.v1.MsgConvertERC20",
      value: {
        contractAddress: "0xAbCd...",  // ERC-20 컨트랙트 주소
        amount: "1000000",             // 변환할 ERC-20 토큰 수량
        receiver: "guru1receiver...", // 수령할 Cosmos bech32 주소
        sender: "0xSenderEth...",     // 보내는 EVM 주소
      },
    },
  ],
  "auto",
);

// Cosmos 코인 → ERC-20 변환
await client.signAndBroadcast(
  senderAddress,
  [
    {
      typeUrl: "/cosmos.evm.erc20.v1.MsgConvertCoin",
      value: {
        coin: { denom: "uguru", amount: "1000000" },
        receiver: "0xReceiverEth...",  // 수령할 EVM 주소
        sender: senderAddress,          // 보내는 Cosmos bech32 주소
      },
    },
  ],
  "auto",
);

// ERC-20 토큰 페어 등록 (거버넌스)
await client.signAndBroadcast(
  govAddress,
  [
    {
      typeUrl: "/cosmos.evm.erc20.v1.MsgRegisterERC20",
      value: {
        signer: govAddress,
        erc20addresses: ["0xToken1...", "0xToken2..."],
      },
    },
  ],
  "auto",
);

// 토큰 변환 토글 (거버넌스)
await client.signAndBroadcast(
  govAddress,
  [
    {
      typeUrl: "/cosmos.evm.erc20.v1.MsgToggleConversion",
      value: {
        authority: govAddress,
        token: "0xAbCd...",  // ERC-20 주소 또는 denom
      },
    },
  ],
  "auto",
);
```

#### Query 사용법

```typescript
// 등록된 모든 토큰 페어 조회
const pairs = await client.forceGetQueryClient().erc20.tokenPairs();
for (const pair of pairs) {
  console.log(`${pair.denom} <-> ${pair.erc20Address}, enabled: ${pair.enabled}`);
}

// 특정 토큰 페어 조회 (ERC-20 주소 또는 denom)
const pair = await client.forceGetQueryClient().erc20.tokenPair("0xAbCd...");
const pair2 = await client.forceGetQueryClient().erc20.tokenPair("uguru");

// ERC-20 모듈 파라미터 조회
const params = await client.forceGetQueryClient().erc20.params();
console.log(params.enableErc20, params.permissionlessRegistration);
```

---

### 5. EVM FeeMarket (`cosmos.evm.feemarket.v1`)

EIP-1559 동적 가스 수수료 메커니즘 모듈입니다. 쿼리 전용(Tx는 거버넌스만 지원).

#### Query 사용법

```typescript
// FeeMarket 파라미터 조회
const params = await client.forceGetQueryClient().evmFeemarket.params();
console.log({
  noBaseFee: params.noBaseFee,
  baseFee: params.baseFee,                           // 현재 기본 수수료 (Dec)
  minGasPrice: params.minGasPrice,                   // 최소 가스 가격
  gasPriceAdjustmentFactor: params.gasPriceAdjustmentFactor,
  maxChangeRate: params.maxChangeRate,               // 블록당 최대 변동률
});

// 현재 블록 기본 수수료 조회
const baseFee = await client.forceGetQueryClient().evmFeemarket.baseFee();
console.log(`Base fee: ${baseFee}`); // Dec 문자열

// 현재 블록 가스 사용량 조회
const gas = await client.forceGetQueryClient().evmFeemarket.blockGas();
console.log(`Block gas used: ${gas}`);
```

#### DynamicGasPriceConfig와 연동

기존 `feemarket.ts`의 `DynamicGasPriceConfig`는 Osmosis/Skip feemarket용입니다.
EVM FeeMarket 기반 동적 가스 가격 설정은 직접 쿼리 후 `GasPrice`를 구성하세요:

```typescript
const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, signer, {
  gasPrice: GasPrice.fromString("0.025uguru"), // 정적 가스 가격
});

// 또는 동적으로 evmFeemarket.baseFee()를 쿼리하여 수동 설정
```

---

## 클라이언트 초기화

새 모듈들은 기본 클라이언트에 자동으로 포함됩니다:

```typescript
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";

// 읽기 전용 클라이언트 (Query 가능)
const readClient = await StargateClient.connect("https://rpc.gurufin.io");

// 서명 클라이언트 (Tx + Query 가능)
const signingClient = await SigningStargateClient.connectWithSigner(
  "https://rpc.gurufin.io",
  signer,
  { gasPrice: GasPrice.fromString("0.025uguru") }
);

// 모든 새 쿼리 extension 즉시 사용 가능
const oracleDoc = await readClient.forceGetQueryClient().oracle.oracleRequestDoc(BigInt(1));
const bexModerator = await readClient.forceGetQueryClient().bex.moderatorAddress();
const tokenPairs = await readClient.forceGetQueryClient().erc20.tokenPairs();
const discounts = await readClient.forceGetQueryClient().feepolicy.discounts();
const baseFee = await readClient.forceGetQueryClient().evmFeemarket.baseFee();
```

## 커스텀 레지스트리/Amino 컨버터

기본 레지스트리와 Amino 컨버터에 모두 포함되어 있습니다:

```typescript
import {
  defaultRegistryTypes,
  bexTypes,
  createDefaultAminoConverters,
  createBexAminoConverters,
  erc20Types,
  feepolicyTypes,
  oracleTypes,
  createErc20AminoConverters,
  createFeepolicyAminoConverters,
  createOracleAminoConverters,
} from "@cosmjs/stargate";

// 기본 레지스트리에 이미 포함:
// - bexTypes (MsgRegisterAdmin, MsgRemoveAdmin, MsgRegisterExchange, MsgUpdateExchange, MsgUpdateRatemeter, MsgWithdrawFees, MsgChangeBexModerator)
// - erc20Types (MsgConvertERC20, MsgConvertCoin, MsgRegisterERC20, MsgToggleConversion)
// - feepolicyTypes (MsgRegisterDiscounts, MsgRemoveDiscounts, MsgChangeModerator)
// - oracleTypes (MsgRegisterOracleRequestDoc, MsgUpdateOracleRequestDoc, MsgSubmitOracleData, MsgUpdateModeratorAddress)

// 커스텀 레지스트리에 수동 추가하는 경우:
import { Registry } from "@cosmjs/proto-signing";
const registry = new Registry([
  ...defaultRegistryTypes,
  // 이미 포함되어 있으므로 별도 추가 불필요
]);
```

## 파일 구조

```
cosmjs/packages/stargate/src/modules/
├── bex/
│   ├── messages.ts
│   ├── aminomessages.ts
│   └── queries.ts
├── oracle/
│   ├── messages.ts        # 타입 정의, 프로토버프 코덱, EncodeObject 인터페이스
│   ├── aminomessages.ts   # Amino JSON 변환기
│   └── queries.ts         # gRPC 쿼리 extension
├── feepolicy/
│   ├── messages.ts
│   ├── aminomessages.ts
│   └── queries.ts
├── erc20/
│   ├── messages.ts
│   ├── aminomessages.ts
│   └── queries.ts
└── evmfeemarket/
    └── queries.ts         # 쿼리 전용
```
