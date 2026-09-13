import test from "node:test";
import assert from "node:assert/strict";
const { protectIos } = require("../plugins/with-private-storage.cjs") as {
  protectIos: (s: string) => string;
};
test("backup exclusion is inserted before React starts and remains idempotent", () => {
  const source =
    "func application() {\n    let delegate = ReactNativeDelegate()\n}";
  const out = protectIos(source);
  assert.ok(out.indexOf("isExcludedFromBackup = true") >= 0);
  assert.ok(
    out.indexOf("isExcludedFromBackup = true") < out.indexOf("let delegate"),
  );
  assert.equal(protectIos(out), out);
});
test("unsupported native template fails instead of silently omitting backup protection", () =>
  assert.throws(() => protectIos("unknown"), /APP_DELEGATE_TEMPLATE/));
