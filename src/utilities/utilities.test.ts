import { describe, it, expect } from "vitest";
import {
  getAvgContractionLength,
  getAvgTimeBetween,
  emptyTime,
  getContractionLength,
  getLaborStart,
  getLastContractionStart,
  getLastFullContraction,
  getLastFullContractionLength,
  getTimeBetween,
  msToTimeStr,
  printInt,
  secToTimeStr,
  timePiecesToStr,
} from "./utilities";
import type { ContractionStore } from "../providers/db/db";

describe("printInt method", () => {
  it("returns negative numbers unchanged", () => {
    expect(printInt(-1)).toBe("-1");
    expect(printInt(-10)).toBe("-10");
  });

  it("return numbers >= 10 unchanged", () => {
    expect(printInt(10)).toBe("10");
    expect(printInt(100)).toBe("100");
  });

  it("returns numbers in range [0,9] with a 0 prepended", () => {
    expect(printInt(0)).toBe("00");
    expect(printInt(1)).toBe("01");
    expect(printInt(5)).toBe("05");
    expect(printInt(9)).toBe("09");
  });

  it("rounds positive floating point numbers with floor function", () => {
    expect(printInt(0.5)).toBe("00");
    expect(printInt(10.5)).toBe("10");
  });

  it("rounds negative floating point numbers with ceiling function", () => {
    expect(printInt(-0.5)).toBe("00");
    expect(printInt(-11.5)).toBe("-11");
  });
});

describe("ms and seconds get converted to time strings correctly", () => {
  describe("time string from individual time components", () => {
    it("outputs minute and seconds for time < hour", () => {
      expect(timePiecesToStr(0, 0, 0), "All 0s").toBe("00:00");
      expect(timePiecesToStr(0, 10, 10), "Seconds and minutes").toBe("10:10");
    });

    it("outputs hours, minute and seconds for times >= hour", () => {
      expect(timePiecesToStr(1, 0, 0), "just hour").toBe("01:00:00");
      expect(timePiecesToStr(2, 0, 10), "hour and seconds").toBe("02:00:10");
      expect(timePiecesToStr(5, 10, 10), "hour, seconds, and minutes").toBe(
        "05:10:10",
      );
    });

    it("shifts more than 60 seconds to minutes", () => {
      expect(timePiecesToStr(0, 0, 60), "Exactly 60 seconds").toBe("01:00");
      expect(timePiecesToStr(0, 0, 71), "More than 60 seconds").toBe("01:11");
      expect(
        timePiecesToStr(0, 0, 120),
        "Exactly 2 minutes worth of seconds",
      ).toBe("02:00");
      expect(
        timePiecesToStr(0, 0, 141),
        "More than 2 minutes plus change",
      ).toBe("02:21");
    });

    it("shifts more than 60 minutes to hours", () => {
      expect(timePiecesToStr(0, 60, 0), "Exactly 60 minutes").toBe("01:00:00");
      expect(timePiecesToStr(0, 61, 0), "60 minutes plus some").toBe(
        "01:01:00",
      );
      expect(timePiecesToStr(1, 60, 0), "1hour plus 60 minutes").toBe(
        "02:00:00",
      );
      expect(
        timePiecesToStr(1, 60, 60),
        "exactly 60 minutes and 60 seconds",
      ).toBe("02:01:00");
      expect(
        timePiecesToStr(2, 58, 121),
        "More than 60 seconds, causes minutes to be more than 60",
      ).toBe("03:00:01");
    });
  });

  describe("sec to timeString", () => {
    it("handles invalid seconds gracefully", () => {
      expect(secToTimeStr(), "undefined seconds").toBe("00:00");
      expect(secToTimeStr(-1), "negative seconds").toBe("00:00");
      expect(msToTimeStr(), "undefined ms").toBe("00:00");
      expect(msToTimeStr(-1), "negative ms").toBe("00:00");
    });

    it("converts seconds to time string", () => {
      expect(secToTimeStr(0), "0 seconds").toBe("00:00");
      expect(secToTimeStr(20), "20 seconds").toBe("00:20");
      expect(secToTimeStr(60), "60 seconds").toBe("01:00");
      expect(secToTimeStr(600), "600 seconds").toBe("10:00");
      expect(secToTimeStr(1234), "1234 seconds").toBe("20:34");
      expect(secToTimeStr(3600), "3600 seconds").toBe("01:00:00");
      expect(secToTimeStr(12345), "12345").toBe("03:25:45");
    });

    it("converts ms to time string", () => {
      expect(msToTimeStr(0), "0 seconds").toBe("00:00");
      expect(msToTimeStr(20000), "20 seconds").toBe("00:20");
      expect(msToTimeStr(60000), "60 seconds").toBe("01:00");
      expect(msToTimeStr(600000), "600 seconds").toBe("10:00");
      expect(msToTimeStr(1234000), "1234 seconds").toBe("20:34");
      expect(msToTimeStr(3600000), "3600 seconds").toBe("01:00:00");
      expect(msToTimeStr(12345000), "12345 seconds").toBe("03:25:45");
    });
  });
});

const contractionStoreA: ContractionStore = {
  id: 0,
  start: 10000,
  end: 15000,
};

const contractionStoreB: ContractionStore = {
  id: 1,
  start: 100,
  end: 2000,
};

const contractions = [...Array(10).keys()].map((val) => ({
  id: val,
  start: val + 1000,
  end: val * 2 + 1000,
}));

describe("getTimeBetween method", () => {
  it("handles invalid contractions gracefully", () => {
    expect(getTimeBetween(undefined, undefined), "both undefined").toBe(
      emptyTime,
    );
    expect(getTimeBetween(contractionStoreA, undefined), "b undefined").toBe(
      emptyTime,
    );
    expect(getTimeBetween(undefined, contractionStoreB), "a undefined").toBe(
      emptyTime,
    );
    expect(
      getTimeBetween({ ...contractionStoreA, start: -100 }, contractionStoreB),
      "a start negative",
    ).toBe(emptyTime);
    expect(
      getTimeBetween(contractionStoreA, { ...contractionStoreB, start: -200 }),
      "b start negative",
    ).toBe(emptyTime);
  });

  it("doesn't care which order the contractions are", () => {
    expect(
      getTimeBetween(contractionStoreA, contractionStoreB),
      "a less than b",
    ).toBe(9900);
    expect(
      getTimeBetween(contractionStoreB, contractionStoreA),
      "b less than a",
    ).toBe(9900);
  });
});

describe("getLaborStart method", () => {
  it("handles invalid contractions gracefully", () => {
    expect(getLaborStart()).toBe(emptyTime);
    expect(getLaborStart([])).toBe(emptyTime);
  });

  it("gets the correct value from array of one", () => {
    expect(getLaborStart([contractionStoreA]).toString(), "array of one").toBe(
      new Date(contractionStoreA.start).toString(),
    );
  });
  it("gets the correct value from array of multiple", () => {
    const first = { ...contractionStoreA, start: 0 };
    expect(
      getLaborStart([
        first,
        { ...contractionStoreA, start: 123456789 },
        { ...contractionStoreA, start: 10000000 },
      ]).toString(),
      "array of multiple",
    ).toBe(new Date(first.start).toString());
  });
});

describe("getLastFullContraction method", () => {
  it("handle invalid contraction list gracefully", () => {
    expect(getLastFullContraction()).toBe(undefined);
    expect(getLastFullContraction([])).toBe(undefined);
    expect(getLastFullContraction([{ id: 0, start: 0 }])).toBe(undefined);
  });

  it("handles normal data", () => {
    expect(
      getLastFullContraction([contractionStoreA]),
      "one full contraction",
    ).toBe(contractionStoreA);
    expect(
      getLastFullContraction([contractionStoreA, contractionStoreB]),
      "Two fullcontractions",
    ).toBe(contractionStoreB);
    expect(
      getLastFullContraction([contractionStoreA, { id: 2, start: 100 }]),
      "one full contraction, one half contraction",
    ).toBe(contractionStoreA);
  });
});

describe("getContractionLength method", () => {
  it("handles invalid data gracefully", () => {
    const start = 100;
    expect(getContractionLength(), "undefined contraction").toBe(0);
    expect(
      getContractionLength({ id: 0, start }),
      "contraction with no end",
    ).toBeCloseTo(new Date().getTime() - start);
    expect(
      getContractionLength({ id: 0, start: 100, end: 10 }),
      "contraction with end less than start",
    ).toBe(0);
  });

  it("handles normal data", () => {
    const start = 100;
    const end = 1000;
    expect(getContractionLength({ id: 0, start, end })).toBe(end - start);
  });
});

describe("getLastFullContractionLength method", () => {
  it("handles invalid data gracefully", () => {
    const start = 100;
    const end = 1000;
    const contraction = { id: 0, start, end };

    expect(getLastFullContractionLength()).toBe(0);
    expect(getLastFullContractionLength([])).toBe(0);
    expect(getLastFullContractionLength([...contractions, contraction])).toBe(
      getContractionLength(contraction),
    );
  });
});

describe("getLastContractionStart method", () => {
  const start = 100;
  const end = 1000;
  const targetContraction = { id: 1, start, end };

  it("handles invalid data gracefully", () => {
    expect(getLastContractionStart(), "undefined array").toBe(0);
    expect(getLastContractionStart([]), "empty array").toBe(0);
  });

  it("handles normal data", () => {
    expect(
      getLastContractionStart([{ id: 1, start }]),
      "contraction no end",
    ).toBe(start);

    expect(
      getLastContractionStart([targetContraction]),
      "one contraction",
    ).toBe(start);

    expect(
      getLastContractionStart([...contractions, targetContraction]),
      "many contractions",
    ).toBe(start);
  });
});

describe("avgContractionLength method", () => {
  it("handles invalid data gracefully", () => {
    expect(getAvgContractionLength(), "undefined contraction array").toBe(0);
    expect(getAvgContractionLength([]), "empty contraction array").toBe(0);
  });

  it("handles regular data", () => {
    const data = [{ id: 0, start: 0, end: 1000 }]; // 1000
    expect(getAvgContractionLength(data, 5), "one contraction array").toBe(
      1000,
    );

    data.push({ id: 1, start: 1001, end: 3500 }); // 2499
    expect(getAvgContractionLength(data, 5), "two contraction array").toBe(
      1749.5,
    );

    data.push(
      ...[
        { id: 2, start: 3501, end: 3505 }, // 4
        { id: 3, start: 3506, end: 3600 }, // 94
        { id: 4, start: 3605, end: 4100 }, // 495
      ],
    );
    expect(
      getAvgContractionLength(data, 5),
      "array length equal to avgSize",
    ).toBeCloseTo(818.4);

    data.push({ id: 5, start: 4101, end: 5000 }); // 899

    expect(
      getAvgContractionLength(data, 5),
      "array length greater than avgSize",
    ).toBeCloseTo(798.2);

    expect(
      getAvgContractionLength(data, 3),
      "unchanged array with different avgSizes work",
    ).toBeCloseTo(496);

    expect(
      getAvgContractionLength(data, 6),
      "unchanged array with different avgSizes work",
    ).toBeCloseTo(831.83);

    expect(
      getAvgContractionLength(data, 0),
      "avgSize 0 averages all values",
    ).toBeCloseTo(831.83);
  });
});

describe("avgTimeBetween method", () => {
  it("handles invalide data gracefully", () => {
    expect(getAvgTimeBetween(), "undefined array").toBe(0);
    expect(getAvgTimeBetween([]), "empty array").toBe(0);
    expect(getAvgTimeBetween([contractionStoreA]), "array of one element").toBe(
      0,
    );
  });

  it("handles normal data", () => {
    const step = 50;
    const data = new Array(10).fill(0).map((_, idx) => ({
      id: idx,
      start: Math.pow(idx, idx + 1) * step + 20,
      end: Math.pow(idx, idx + 1) * step + 21,
    }));

    expect(getAvgTimeBetween(data.slice(0, 2), 5), "Array of size two").toBe(
      50,
    );
    expect(getAvgTimeBetween(data.slice(1, 3), 5), "length avgSize - 3").toBe(
      350,
    );

    expect(getAvgTimeBetween(data.slice(0, 3), 5), "length = avgSize - 2").toBe(
      200,
    );
    expect(getAvgTimeBetween(data.slice(0, 4), 5), "length = avgSize - 1").toBe(
      1350,
    );
    expect(getAvgTimeBetween(data.slice(0, 5), 5), "length = avgSize").toBe(
      12800,
    );
    expect(getAvgTimeBetween(data.slice(0, 6), 5), "length = avgSize+1").toBe(
      156250,
    );
    expect(getAvgTimeBetween(data.slice(0, 8), 5), "length = avgSize+2").toBe(
      57647930,
    );
    expect(getAvgTimeBetween(data, 5), "length is much longer").toBe(
      34867833770,
    );
  });
});

/* 
[
    { id: 0, start: 20, end: 21 },
    { id: 1, start: 70, end: 71 },             // 50
    { id: 2, start: 420, end: 421 },           // 350
    { id: 3, start: 4070, end: 4071 },         // 3650
    { id: 4, start: 51220, end: 51221 },       // 47150
    { id: 5, start: 781270, end: 781271 },     // 730_051
    { id: 6, start: 13996820, end: 13996821 }, // 13_215_550
    { id: 7, start: 288240070, end: 288240071 }, // 274_243_250
    { id: 8, start: 6710886420, end: 6710886421 }, // 6_422_646_350
    { id: 9, start: 174339220070, end: 174339220071 } //167_628_333_650
  ]
*/
