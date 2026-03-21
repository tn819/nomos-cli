**nomos-sdk-cli**

***

# nomos-sdk-cli

## Classes

### NomosSDK

Defined in: [sdk.ts:4](https://github.com/tn819/nomos-cli/blob/main/src/sdk.ts#L4)

#### Constructors

##### Constructor

> **new NomosSDK**(`options?`): [`NomosSDK`](#nomossdk)

Defined in: [sdk.ts:11](https://github.com/tn819/nomos-cli/blob/main/src/sdk.ts#L11)

###### Parameters

###### options?

[`NomosSdkOptions`](#nomossdkoptions) = `{}`

###### Returns

[`NomosSDK`](#nomossdk)

#### Methods

##### call()

> **call**(`key`, `input?`): `Promise`\<\{ `data`: `unknown`; `headers`: `Headers`; `status`: `number`; \}\>

Defined in: [sdk.ts:34](https://github.com/tn819/nomos-cli/blob/main/src/sdk.ts#L34)

###### Parameters

###### key

`string`

###### input?

[`CallInput`](#callinput) = `{}`

###### Returns

`Promise`\<\{ `data`: `unknown`; `headers`: `Headers`; `status`: `number`; \}\>

##### getOperation()

> **getOperation**(`key`): [`OperationDefinition`](#operationdefinition)

Defined in: [sdk.ts:26](https://github.com/tn819/nomos-cli/blob/main/src/sdk.ts#L26)

###### Parameters

###### key

`string`

###### Returns

[`OperationDefinition`](#operationdefinition)

##### listOperations()

> **listOperations**(): [`OperationDefinition`](#operationdefinition)[]

Defined in: [sdk.ts:22](https://github.com/tn819/nomos-cli/blob/main/src/sdk.ts#L22)

###### Returns

[`OperationDefinition`](#operationdefinition)[]

## Interfaces

### CallInput

Defined in: [types.ts:15](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L15)

#### Properties

##### auth?

> `optional` **auth?**: [`OperationSecurity`](#operationsecurity)

Defined in: [types.ts:20](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L20)

##### body?

> `optional` **body?**: `unknown`

Defined in: [types.ts:18](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L18)

##### headers?

> `optional` **headers?**: `Record`\<`string`, `string`\>

Defined in: [types.ts:19](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L19)

##### path?

> `optional` **path?**: `Record`\<`string`, `string` \| `number`\>

Defined in: [types.ts:16](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L16)

##### query?

> `optional` **query?**: `Record`\<`string`, `string` \| `number` \| `boolean` \| (`string` \| `number` \| `boolean`)[] \| `null` \| `undefined`\>

Defined in: [types.ts:17](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L17)

***

### NomosSdkOptions

Defined in: [types.ts:23](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L23)

#### Properties

##### baseUrl?

> `optional` **baseUrl?**: `string`

Defined in: [types.ts:24](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L24)

##### basicAuth?

> `optional` **basicAuth?**: `object`

Defined in: [types.ts:27](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L27)

###### password

> **password**: `string`

###### username

> **username**: `string`

##### bearerToken?

> `optional` **bearerToken?**: `string`

Defined in: [types.ts:26](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L26)

##### defaultHeaders?

> `optional` **defaultHeaders?**: `Record`\<`string`, `string`\>

Defined in: [types.ts:31](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L31)

##### specVersion?

> `optional` **specVersion?**: `string`

Defined in: [types.ts:25](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L25)

***

### OperationDefinition

Defined in: [types.ts:5](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L5)

#### Properties

##### key

> **key**: `string`

Defined in: [types.ts:6](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L6)

##### method

> **method**: `HttpMethod`

Defined in: [types.ts:7](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L7)

##### path

> **path**: `string`

Defined in: [types.ts:8](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L8)

##### security

> **security**: [`OperationSecurity`](#operationsecurity)[]

Defined in: [types.ts:11](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L11)

##### specVersion

> **specVersion**: `string`

Defined in: [types.ts:12](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L12)

##### summary

> **summary**: `string`

Defined in: [types.ts:9](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L9)

##### tags

> **tags**: `string`[]

Defined in: [types.ts:10](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L10)

## Type Aliases

### OperationSecurity

> **OperationSecurity** = `"bearer"` \| `"basic"` \| `"none"`

Defined in: [types.ts:3](https://github.com/tn819/nomos-cli/blob/main/src/types.ts#L3)

## Functions

### getAvailableVersions()

> **getAvailableVersions**(): `string`[]

Defined in: [overview.ts:11](https://github.com/tn819/nomos-cli/blob/main/src/overview.ts#L11)

#### Returns

`string`[]

***

### getLatestVersion()

> **getLatestVersion**(): `string`

Defined in: [overview.ts:15](https://github.com/tn819/nomos-cli/blob/main/src/overview.ts#L15)

#### Returns

`string`

***

### getOperations()

> **getOperations**(`version?`): [`OperationDefinition`](#operationdefinition)[]

Defined in: [overview.ts:19](https://github.com/tn819/nomos-cli/blob/main/src/overview.ts#L19)

#### Parameters

##### version?

`string` = `data.latest`

#### Returns

[`OperationDefinition`](#operationdefinition)[]

***

### getVersionDiff()

> **getVersionDiff**(`baseVersion`, `compareVersion`): `object`

Defined in: [overview.ts:44](https://github.com/tn819/nomos-cli/blob/main/src/overview.ts#L44)

#### Parameters

##### baseVersion

`string`

##### compareVersion

`string`

#### Returns

`object`

##### added

> **added**: [`OperationDefinition`](#operationdefinition)[]

##### removed

> **removed**: [`OperationDefinition`](#operationdefinition)[]

***

### groupOperationsByTag()

> **groupOperationsByTag**(`version?`): `Map`\<`string`, [`OperationDefinition`](#operationdefinition)[]\>

Defined in: [overview.ts:27](https://github.com/tn819/nomos-cli/blob/main/src/overview.ts#L27)

#### Parameters

##### version?

`string` = `data.latest`

#### Returns

`Map`\<`string`, [`OperationDefinition`](#operationdefinition)[]\>
