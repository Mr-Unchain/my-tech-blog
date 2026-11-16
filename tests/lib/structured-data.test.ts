import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "../../src/lib/structured-data";

describe("serializeJsonLd", () => {
  it("preserves structured data as valid JSON", () => {
    const data = { "@context": "https://schema.org", name: "記事", count: 3 };
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
  it("prevents embedded HTML from closing its script element", () => {
    const data = {
      name: "</script><script>alert(1)</script>",
      description: "<!--",
    };
    const result = serializeJsonLd(data);
    expect(result).not.toContain("<");
    expect(JSON.parse(result)).toEqual(data);
  });
});
