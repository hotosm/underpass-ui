class BaseRequest {
  constructor(data) {
    if (data instanceof BaseRequest) {
      return data;
    }
    this.area = data.area;
    this.tags = data.tags;
    this.hashtag = data.hashtag;
    this.dateFrom = data.dateFrom;
    this.dateTo = data.dateTo;
  }

  getObject() {
    return {
      area: this.area,
      tags: this.tags,
      hashtag: this.hashtag,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
    };
  }

  toJSON() {
    return JSON.stringify(this.getObject());
  }
}

class BaseListRequest extends BaseRequest {
  constructor(data) {
    super(data);
    this.orderBy = data.orderBy;
    this.page = data.page;
  }

  getObject() {
    return {
      ...super.getObject(),
      orderBy: this.orderBy,
      page: this.page,
    };
  }
}

class BaseRawValidationRequest extends BaseRequest {
  constructor(data) {
    super(data);
    this.status = data.status;
  }

  getObject() {
    return {
      ...super.getObject(),
      status: this.status,
    };
  }
}

export class RawValidationListRequest extends BaseRawValidationRequest {
  constructor(data) {
    super(data);
    this.orderBy = data.orderBy;
    this.page = data.page;
  }

  getObject() {
    return {
      ...super.getObject(),
      orderBy: this.orderBy,
      page: this.page,
    };
  }
}

export class RawRequest extends BaseRequest {}
export class RawListRequest extends BaseListRequest {}
export class RawValidationRequest extends BaseRawValidationRequest {}
export class RawValidationStatsRequest extends BaseRawValidationRequest {}
export class StatsRequest extends BaseRequest {}
