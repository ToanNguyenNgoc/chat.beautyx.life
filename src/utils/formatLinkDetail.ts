import slugify from "src/utils/formatUrlString";

export const formatRouterLinkProduct = (
  id: number | string,
  org_id: number | string,
  name: string
) => {
  const pathname = `https://beautyx.vn/san-pham/${id}_${org_id}_${slugify(
    name
  )}`;
  return pathname;
};
//---
export const formatRouterLinkService = (
  id: number | string,
  org_id: number | string,
  name: string
) => {
  const pathname = `https://beautyx.vn/dich-vu/${id}_${org_id}_${slugify(
    name
  )}`;
  return pathname;
};
export const formatLinkDetail = (
  id: number | string,
  org_id: number | string,
  name: string,
  type:
    | "SERVICE"
    | "PRODUCT"
    | "COMBO"
    | "App\\Models\\CI\\Service"
    | "App\\Models\\CI\\Product"
    | "App\\Models\\CI\\TreatmentCombo"
) => {
  let link: string = "";
  if (type === "SERVICE" || type === "App\\Models\\CI\\Service") {
    link = formatRouterLinkService(id, org_id, name);
  }
  if (type === "PRODUCT" || type === "App\\Models\\CI\\Product") {
    link = formatRouterLinkProduct(id, org_id, name);
  }
  if (type === "COMBO" || type === "App\\Models\\CI\\TreatmentCombo") {
    link = `/combo-detail/${id}_${org_id}_${slugify(name)}`;
  }
  return link;
};
