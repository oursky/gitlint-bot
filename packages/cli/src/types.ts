export interface CliFlags {
  config?: string;
  from?: string;
  to?: string;
  stdin?: boolean;
  _: string[];
  $0: string;
}
