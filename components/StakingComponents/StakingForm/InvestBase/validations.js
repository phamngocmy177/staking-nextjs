import { REQUIRED } from "components/AppComponents/AppForm/constants";

export default {
  required: (value) => (value ? undefined : REQUIRED),
};
