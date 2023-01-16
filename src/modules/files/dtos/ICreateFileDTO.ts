export interface ICreateFileDTO {
  name: string;
  description: string;
  fileName: string;
  action_id: string;
  parent_id: string | null;
  from_id: string;
  to_id: string;
}
