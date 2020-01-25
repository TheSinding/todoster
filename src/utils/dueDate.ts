import { addMilliseconds, parseISO } from "date-fns";
import ms from "ms";
import jsyaml from "js-yaml";
import fs from "fs";

import { da } from "date-fns/locale";
function getEnvLocale() {
  let env = process.env;
  console.log();

  const rawdata = fs.readFileSync(__dirname + "/dateformats.yaml", "utf8");
  const formats = jsyaml.load(rawdata);
  console.log(formats);

  return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
}

export default (val: string): number => {
  console.log(getEnvLocale());

  console.log(val, ms(val));
  //@ts-ignore
  console.log(parseISO(val), da.formatDistance());
  if (ms(val)) return addMilliseconds(new Date(), ms(val)).valueOf();
  return parseISO(val).valueOf();
};
