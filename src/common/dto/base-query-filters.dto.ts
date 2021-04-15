
enum orderEnum {
  asc = 'asc',
  desc = 'desc'
}

export abstract class BaseQueryFiltersDto {

  // '?:' format is used intentionally so that Swagger recognizes the dtos properly
  page?: number = 1;

  limit?: number  = 20;

  order?: orderEnum = orderEnum.desc;

  sort_by?: string = 'created_at';

  // search?: string;
}
