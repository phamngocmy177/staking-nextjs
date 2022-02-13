import { REQUIRED } from "components/AppComponents/KeytangoForm/constants";

export default {
  required: (value) => (value ? undefined : REQUIRED),
};
