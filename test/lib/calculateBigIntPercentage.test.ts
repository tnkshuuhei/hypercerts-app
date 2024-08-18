import { describe, it, expect } from "vitest";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";

describe("calculateBigIntPercentage", () => {
  it("should return the correct percentage", () => {
    expect(calculateBigIntPercentage("1", "100")).to.eq(1);
    expect(calculateBigIntPercentage("100", "100")).to.eq(100);
    expect(calculateBigIntPercentage("100", "200")).to.eq(50);

    expect(calculateBigIntPercentage("1", "1000")).to.eq(0.1);
    expect(calculateBigIntPercentage("1", "10000")).to.eq(0.01);
    expect(calculateBigIntPercentage("1", "100000")).to.eq(0.001);
    expect(calculateBigIntPercentage("1", "1000000")).to.eq(0.0001);
    expect(calculateBigIntPercentage("1", "10000000")).to.eq(0.00001);
    expect(calculateBigIntPercentage("1", "100000000")).to.eq(0.000001);
    expect(calculateBigIntPercentage("1", "1000000000")).to.eq(0.0000001);
    expect(calculateBigIntPercentage("1", "10000000000")).to.eq(0.00000001);
    expect(calculateBigIntPercentage("1", "100000000000")).to.eq(0.000000001);
    expect(calculateBigIntPercentage("1", "1000000000000")).to.eq(0.0000000001);
    expect(calculateBigIntPercentage("1", "10000000000000")).to.eq(
      0.00000000001,
    );
    expect(calculateBigIntPercentage("1", "100000000000000")).to.eq(
      0.000000000001,
    );
    expect(calculateBigIntPercentage("1", "1000000000000000")).to.eq(
      0.0000000000001,
    );
    expect(calculateBigIntPercentage("1", "10000000000000000")).to.eq(
      0.00000000000001,
    );
    expect(calculateBigIntPercentage("1", "100000000000000000")).to.eq(
      0.000000000000001,
    );
    expect(calculateBigIntPercentage("1", "1000000000000000000")).to.eq(
      0.0000000000000001,
    );
    expect(calculateBigIntPercentage("1", "10000000000000000000")).to.eq(
      0.00000000000000001,
    );

    // Values of 2
    expect(calculateBigIntPercentage("2", "100")).to.eq(2);
    expect(calculateBigIntPercentage("2", "1000")).to.eq(0.2);
    expect(calculateBigIntPercentage("2", "10000")).to.eq(0.02);
    expect(calculateBigIntPercentage("2", "100000")).to.eq(0.002);
    expect(calculateBigIntPercentage("2", "1000000")).to.eq(0.0002);
    expect(calculateBigIntPercentage("2", "10000000")).to.eq(0.00002);
    expect(calculateBigIntPercentage("2", "100000000")).to.eq(0.000002);
    expect(calculateBigIntPercentage("2", "1000000000")).to.eq(0.0000002);
    expect(calculateBigIntPercentage("2", "10000000000")).to.eq(0.00000002);
    expect(calculateBigIntPercentage("2", "100000000000")).to.eq(0.000000002);
    expect(calculateBigIntPercentage("2", "1000000000000")).to.eq(0.0000000002);
    expect(calculateBigIntPercentage("2", "10000000000000")).to.eq(
      0.00000000002,
    );
    expect(calculateBigIntPercentage("2", "100000000000000")).to.eq(
      0.000000000002,
    );
    expect(calculateBigIntPercentage("2", "1000000000000000")).to.eq(
      0.0000000000002,
    );
    expect(calculateBigIntPercentage("2", "10000000000000000")).to.eq(
      0.00000000000002,
    );
    expect(calculateBigIntPercentage("2", "100000000000000000")).to.eq(
      0.000000000000002,
    );
    expect(calculateBigIntPercentage("2", "1000000000000000000")).to.eq(
      0.0000000000000002,
    );
  });
});
