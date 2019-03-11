declare module 'plaid' {
  import { CoreOptions } from 'request';

  type Callback<T extends Object> = (err: Error, response: T) => void;
  type Iso8601DateString = string; // YYYY-MM-DD
  type Iso8601DateTimeString = string; // YYYY-MM-DDTHH:MM:SSZ

  interface AccessTokenFn<T> {
    (accessToken: string): Promise<T>;
    (accessToken: string, cb: Callback<T>): void;
  }

  // OPTIONS /////////////////////////////////////////////////////////////////

  interface ClientRequestOptions {
    timeout: number;
  }

  interface ItemRequestOptions {
    account_ids?: Array<string>;
  }

  interface TransactionsRequestOptions extends ItemRequestOptions {
    count?: number;
    offset?: number;
  }

  interface GetAllTransactionsRequestOptions extends ItemRequestOptions {}

  interface AssetReportUser {
    client_user_id?: string | null;
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
    ssn?: string | null;
    phone_number?: string | null;
    email?: string | null;
  }

  interface AssetReportCreateOptions {
    client_report_id?: string | null;
    webhook?: string;
    user?: AssetReportUser;
  }

  type AssetReportRefreshOptions = AssetReportCreateOptions;

  // DATA TYPES //////////////////////////////////////////////////////////////

  interface AccountCommon {
    account_id: string;
    mask: string | null;
    name: string | null;
    official_name: string | null;
    subtype: string | null;
    type: string  | null;
  }

  interface Account extends AccountCommon {
    balances: {
      available: number | null;
      current: number | null;
      limit: number | null;
      iso_currency_code: string | null;
      official_currency_code: string | null;
    };
  }

  interface Category {
    type: string;
    hierarchy: Array<string>;
    category_id: string;
  }

  interface PlaidError {
    error_type: string;
    error_code: string;
    error_message: string;
    display_message: string | null;
    causes?: Array<Cause>;
  }

  interface Warning {
    warning_type: string;
    warning_code: string;
    cause: Cause;
  }

  interface Cause extends PlaidError {
    item_id: string;
  }

  interface Item {
    available_products: Array<string>;
    billed_products: Array<string>;
    error: PlaidError | null;
    institution_id: string;
    item_id: string;
    webhook: string;
  }

  interface Credential {
    name: string;
    label: string;
    type: 'text' | 'password';
  }

  interface Institution {
    credentials: Array<Credential>;
    has_mfa: boolean;
    institution_id: string;
    mfa: Array<string>;
    name: string;
    products: Array<string>;
  }

  interface InstitutionWithDisplayData extends Institution {
    colors: Map<string, string>;
    logo: string | null;
    name_break: number | null;
    url_account_locked: string | null;
    url_account_setup: string | null;
    url_forgotten_password: string | null;
  }

  interface InstitutionWithInstitutionData extends Institution {
    logo: string;
    primary_color: string;
    url: string;
  }

  interface InstitutionWithContactData extends Institution {
    addresses: Array<{
      city: string;
      country: string;
      state: string;
      street: Array<string>;
      zip: string;
    }>;
  }

  interface IncomeStream {
    monthly_income: number;
    confidence: number;
    days: number;
    name: string;
  }

  interface Income {
    income_streams: Array<IncomeStream>;
    last_year_income: number;
    last_year_income_before_tax: number;
    projected_yearly_income: number;
    projected_yearly_income_before_tax: number;
    max_number_of_overlapping_income_streams: number;
    number_of_income_streams: number;
  }

  interface Identity {
    addresses: Array<Address>;
    emails: Array<Email>;
    names: Array<string>;
    phone_numbers: Array<PhoneNumber>;
  }

  interface AccountIdentity {
    addresses: Array<Address>;
    emails: Array<Email>;
    names: Array<string>;
    phone_numbers: Array<PhoneNumber>;
  }

  interface Address {
    accounts: Array<string>;
    data: AddressData;
    primary: boolean;
  }

  interface AccountAddress {
    data: AddressData;
    primary: boolean;
  }

  interface AddressData {
    city: string;
    state: string;
    zip: string;
    street: string;
  }

  interface Email {
    data: string;
    primary: boolean;
    type: string;
  }

  interface PhoneNumber {
    data: string;
    primary: boolean;
    type: string;
  }

  interface TransactionLocation {
    address: string | null;
    city: string | null;
    lat: number | null;
    lon: number | null;
    state: string | null;
    store_number: string | null;
    zip: string | null;
  }

  interface TransactionPaymentMeta {
    by_order_of: string | null;
    payee: string | null;
    payer: string | null;
    payment_method: string | null;
    payment_processor: string | null;
    ppd_id: string | null;
    reason: string | null;
    reference_number: string | null
  }

  interface Transaction {
    account_id: string;
    account_owner: string | null;
    amount: number | null;
    iso_currency_code: string | null;
    official_currency_code: string | null;
    category: Array<string> | null;
    category_id: string | null;
    date: Iso8601DateString;
    location: TransactionLocation;
    name: string | null;
    payment_meta: TransactionPaymentMeta;
    pending: boolean | null;
    pending_transaction_id: string | null;
    transaction_id: string;
    transaction_type: string | null;
  }

  interface AssetReport {
    asset_report_id: string;
    client_report_id: string | null;
    date_generated: Iso8601DateTimeString;
    days_requested: number;
    items: Array<AssetReportItem>;
    user: AssetReportUser;
  }

  interface AssetReportItem {
    item_id: string;
    accounts: Array<AssetReportAccount>;
    institution_id: string;
    institution_name: string;
    date_last_updated: Iso8601DateTimeString;
  }

  interface AssetReportAccount extends AccountCommon {
    balances: {
      available: number | null;
      current: number | null;
    };
    days_available: number;
    historical_balances: Array<HistoricalBalance>;
    transactions: Array<AssetReportTransaction>;
    owners: Array<Identity>;
  }

  interface HistoricalBalance {
    date: Iso8601DateString;
    current: number;
  }

  interface AssetReportTransaction {
    account_id: string;
    transaction_id: string;
    date: Iso8601DateString;
    original_description: string | null;
    pending: boolean | null;
    amount: number | null;

    // These fields only exist in an Asset Report with Insights. For more, see
    // https://plaid.com/docs/#retrieve-json-report-request.
    account_owner?: string;
    category?: Array<string>;
    category_id?: string;
    date_transacted?: string;
    location?: TransactionLocation;
    name?: string;
    payment_meta?: TransactionPaymentMeta;
    pending_transaction_id?: string;
    transaction_type?: string;
  }

  interface ACHNumbers {
    account: string;
    account_id: string;
    routing: string;
    wire_routing: string;
  }

  interface EFTNumbers {
    account: string;
    account_id: string;
    institution: string;
    branch: string;
  }

  // RESPONSES

  interface BaseResponse {
    request_id: string;
  }

  interface AccountsResponse extends BaseResponse {
    accounts: Array<Account>;
    item: Item;
  }

  interface AuthResponse extends BaseResponse {
    accounts: Array<Account>;
    item: Item;
    numbers: {
      ach: Array<ACHNumbers>;
      eft: Array<EFTNumbers>;
    }
  }

  interface CreditDetailsResponse extends AccountsResponse {}

  interface IncomeResponse extends AccountsResponse {
    income: Income;
  }

  interface IdentityResponse extends AccountsResponse {
    identity: Identity;
  }

  interface ItemResponse extends BaseResponse {
    item: Item;
  }

  interface CreatePublicTokenResponse extends BaseResponse {
    public_token: string;
  }

  interface CreateProcessorTokenResponse extends BaseResponse {
    processor_token: string;
  }

  interface RotateAccessTokenResponse extends BaseResponse {
    new_access_token: string;
  }

  interface ItemDeleteResponse extends BaseResponse {
    deleted: true;
  }

  interface ItemRemoveResponse extends BaseResponse {
    removed: true;
  }

  interface ResetLoginResponse extends BaseResponse {
    reset_login: true;
  }

  interface GetInstitutionsResponse<T extends Institution> extends BaseResponse {
    institutions: Array<T>;
  }

  interface GetInstitutionByIdResponse<T extends Institution> extends BaseResponse {
    institution: T;
  }

  interface CategoriesResponse extends BaseResponse {
    categories: Array<Category>;
  }

  interface TokenResponse extends BaseResponse {
    access_token: string;
    item_id: string;
  }

  interface TransactionsResponse extends BaseResponse {
    accounts: Array<Account>;
    total_transactions: number;
    transactions: Array<Transaction>;
    item: Item;
  }

  interface AssetReportCreateResponse extends BaseResponse {
    asset_report_id: string;
    asset_report_token: string;
  }

  type AssetReportFilterResponse = AssetReportCreateResponse;
  type AssetReportRefreshResponse = AssetReportCreateResponse;

  interface AssetReportGetResponse extends BaseResponse {
    report: AssetReport;
    warnings: Array<Warning>;
  }

  interface AssetReportGetPdfResponse extends BaseResponse {
    buffer: Buffer;
  }

  interface AuditCopyCreateResponse extends BaseResponse {
    audit_copy_token: string;
  }

  type AuditCopyGetResponse = AssetReportGetResponse;

  interface AuditCopyRemoveResponse extends BaseResponse {
    removed: boolean;
  }

  interface AssetReportRemoveResponse extends BaseResponse {
    removed: boolean;
  }

  interface SandboxPublicTokenCreateResponse extends BaseResponse {
    public_token: string;
  }

  interface ClientOptions extends CoreOptions {
    version?: '2018-05-22' | '2017-03-08';
  }

  class Client {
    constructor (
      clientId: string,
      secret: string,
      publicKey: string,
      env: string,
      options?: ClientOptions,
    )

    exchangePublicToken(publicToken: string): Promise<TokenResponse>;
    exchangePublicToken(publicToken: string,
                        cb: Callback<TokenResponse>,
    ): void;

    createPublicToken: AccessTokenFn<CreatePublicTokenResponse>;

    createProcessorToken(accessToken: string,
                         accountId: string,
                         processor: string,
                         cb: Callback<CreateProcessorTokenResponse>,
    ): void;
    createProcessorToken(accessToken: string,
                         accountId: string,
                         processor: string,
    ): Promise<CreateProcessorTokenResponse>;

    createStripeToken(accessToken: string,
                      accountId: string,
                      cb: Callback<CreateProcessorTokenResponse>,
    ): void;
    createStripeToken(accessToken: string,
                      accountId: string,
    ): Promise<CreateProcessorTokenResponse>;

    invalidateAccessToken: AccessTokenFn<RotateAccessTokenResponse>;

    updateAccessTokenVersion(legacyAccessToken: string,
    ): Promise<TokenResponse>;
    updateAccessTokenVersion(legacyAccessToken: string,
                             cb: Callback<TokenResponse>,
    ): void;

    deleteItem: AccessTokenFn<ItemDeleteResponse>;

    removeItem: AccessTokenFn<ItemRemoveResponse>;

    getItem: AccessTokenFn<ItemResponse>;

    updateItemWebhook(accessToken: string,
                      webhook: string,
    ): Promise<ItemResponse>;
    updateItemWebhook(accessToken: string,
                      webhook: string,
                      cb: Callback<ItemResponse>,
    ): void;

    getAccounts(accessToken: string,
                options?: ItemRequestOptions,
    ): Promise<AccountsResponse>;
    getAccounts(accessToken: string,
                cb: Callback<AccountsResponse>,
    ): void;
    getAccounts(accessToken: string,
                options: ItemRequestOptions,
                cb: Callback<AccountsResponse>,
    ): void;

    getBalance(accessToken: string,
               options?: ItemRequestOptions,
    ): Promise<AccountsResponse>;
    getBalance(accessToken: string,
               cb: Callback<AccountsResponse>,
    ): void;
    getBalance(accessToken: string,
               options: ItemRequestOptions,
               cb: Callback<AccountsResponse>,
    ): void;

    getAuth(accessToken: string,
            options?: ItemRequestOptions,
    ): Promise<AuthResponse>;
    getAuth(accessToken: string,
            cb: Callback<AuthResponse>,
    ): void;
    getAuth(accessToken: string,
            options: ItemRequestOptions,
            cb: Callback<AuthResponse>,
    ): void;

    // getIdentity(String, Function)
    getIdentity: AccessTokenFn<IdentityResponse>;
    // getIncome(String, Function)
    getIncome: AccessTokenFn<IncomeResponse>;
    // getCreditDetails(String, Function)
    getCreditDetails: AccessTokenFn<CreditDetailsResponse>;

    // createAssetReport([String], Number, Object, Function)
    createAssetReport(access_tokens: Array<string>,
                      days_requested: number,
                      options: AssetReportCreateOptions,
                      cb: Callback<AssetReportCreateResponse>): void;

    createAssetReport(access_tokens: Array<string>,
                      days_requested: number,
                      options: AssetReportCreateOptions): Promise<AssetReportCreateResponse>;

    // filterAssetReport(String, [String], Function)
    filterAssetReport(asset_report_token: string,
                      account_ids_to_exclude: Array<string>,
                      cb: Callback<AssetReportFilterResponse>): void;

    filterAssetReport(asset_report_token: string,
                      account_ids_to_exclude: Array<string>): Promise<AssetReportFilterResponse>;

    // refreshAssetReport(String, Number, Object, Function)
    refreshAssetReport(asset_report_token: string,
                       days_requested: number,
                       options: AssetReportRefreshOptions,
                       cb: Callback<AssetReportRefreshResponse>): void;

    refreshAssetReport(asset_report_token: string,
                       days_requested: number,
                       options?: AssetReportRefreshOptions): Promise<AssetReportRefreshResponse>;

    // getAssetReport(String, Boolean, Function)
    getAssetReport(asset_report_token: string,
                   include_insights: boolean,
                   cb: Callback<AssetReportGetResponse>): void;

    getAssetReport(asset_report_token: string,
                   include_insights: boolean): Promise<AssetReportGetResponse>;

    // getAssetReportPdf(String, Function)
    getAssetReportPdf(asset_report_token: string,
                      cb: Callback<AssetReportGetPdfResponse>): void;

    getAssetReportPdf(asset_report_token: string): Promise<AssetReportGetPdfResponse>;

    // createAuditCopy(String, String, Function)
    createAuditCopy(asset_report_token: string,
                    auditor_id: string,
                    cb: Callback<AuditCopyCreateResponse>): void;

    createAuditCopy(asset_report_token: string,
                    auditor_id: string): Promise<AuditCopyCreateResponse>;

    // getAuditCopy(String, Function)
    getAuditCopy(audit_copy_token: string,
                 cb: Callback<AuditCopyGetResponse>): void;

    getAuditCopy(audit_copy_token: string): Promise<AuditCopyGetResponse>;

    // removeAuditCopy(String, Function)
    removeAuditCopy(audit_copy_token: string,
                    cb: Callback<AuditCopyRemoveResponse>): void;

    removeAuditCopy(audit_copy_token: string): Promise<AuditCopyRemoveResponse>;

    // removeAssetReport(String, Function)
    removeAssetReport(asset_report_token: string,
                      cb: Callback<AssetReportRemoveResponse>): void;

    removeAssetReport(asset_report_token: string): Promise<AssetReportRemoveResponse>;

    // getTransactions(String, Date, Date, Object?, Function)
    getTransactions(accessToken: string,
                    startDate: Iso8601DateString,
                    endDate: Iso8601DateString,
                    options?: TransactionsRequestOptions,
    ): Promise<TransactionsResponse>;
    getTransactions(accessToken: string,
                    startDate: Iso8601DateString,
                    endDate: Iso8601DateString,
                    cb: Callback<TransactionsResponse>,
    ): void;
    getTransactions(accessToken: string,
                    startDate: Iso8601DateString,
                    endDate: Iso8601DateString,
                    options: TransactionsRequestOptions,
                    cb: Callback<TransactionsResponse>,
    ): void;

    // getAllTransactions(String, Date, Date, Object?, Function)
    getAllTransactions(accessToken: string,
                       startDate: Iso8601DateString,
                       endDate: Iso8601DateString,
                       options?: GetAllTransactionsRequestOptions,
    ): Promise<Array<Transaction>>;
    getAllTransactions(accessToken: string,
                       startDate: Iso8601DateString,
                       endDate: Iso8601DateString,
                       cb: Callback<Array<Transaction>>,
    ): void;
    getAllTransactions(accessToken: string,
                       startDate: Iso8601DateString,
                       endDate: Iso8601DateString,
                       options: GetAllTransactionsRequestOptions,
                       cb: Callback<Array<Transaction>>,
    ): void;

    getInstitutions(count: number,
                    offset: number,
    ): Promise<GetInstitutionsResponse<Institution>>;
    getInstitutions(count: number,
                    offset: number,
                    cb: Callback<GetInstitutionsResponse<Institution>>,
    ): void;

    getInstitutionById<T extends Institution>(institutionId: string,
                        options?: Object,
    ): Promise<GetInstitutionByIdResponse<T>>;
    getInstitutionById(institutionId: string,
                        cb: Callback<GetInstitutionByIdResponse<Institution>>,
    ): void;
    getInstitutionById(institutionId: string,
                        options: Object,
                        cb: Callback<GetInstitutionByIdResponse<Institution>>,
    ): void;

    searchInstitutionsByName(query: string,
                             products: Array<string>,
                             options: Object,
    ): Promise<GetInstitutionsResponse<Institution>>;
    searchInstitutionsByName(query: string,
                             products: Array<string>,
                             options: Object,
                             cb: Callback<GetInstitutionsResponse<Institution>>,
    ): void;

    getCategories(): Promise<CategoriesResponse>;
    getCategories(cb: Callback<CategoriesResponse>): void;

    resetLogin: AccessTokenFn<ResetLoginResponse>;

    // sandboxPublicTokenCreate(String, Array<String>, Object, Function)
    sandboxPublicTokenCreate(
      institutionId: string,
      initialProducts: Array<string>,
      options: Object,
      cb: Callback<SandboxPublicTokenCreateResponse>,
    ): void;

    // sandboxPublicTokenCreate(String, Array<String>, Object)
    sandboxPublicTokenCreate(
      institutionId: string,
      initialProducts: Array<string>,
      options?: Object,
    ): Promise<SandboxPublicTokenCreateResponse>;
  }

  interface PlaidEnvironments {
    production: 'https://production.plaid.com';
    sandbox: 'https://sandbox.plaid.com';
    development: 'https://development.plaid.com';
    [env: string]: string;
  }
  const environments: PlaidEnvironments;

  export function isPlaidError(err: any): err is PlaidError;
}