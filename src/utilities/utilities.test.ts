import { describe, it, expect } from "vitest";
import {
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
    ).toBe("00:09");
    expect(
      getTimeBetween(contractionStoreB, contractionStoreA),
      "b less than a",
    ).toBe("00:09");
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
    expect(getContractionLength(), "undefined contraction").toBe(-1);
    expect(
      getContractionLength({ id: 0, start }),
      "contraction with no end",
    ).toBeCloseTo(new Date().getTime() - start);
    expect(
      getContractionLength({ id: 0, start: 100, end: 10 }),
      "contraction with end less than start",
    ).toBe(-1);
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

    expect(getLastFullContractionLength()).toBe(emptyTime);
    expect(getLastFullContractionLength([])).toBe(emptyTime);
    expect(getLastFullContractionLength([...contractions, contraction])).toBe(
      msToTimeStr(getContractionLength(contraction)),
    );
  });
});

describe("getLastContractionStart method", () => {
  const start = 100;
  const end = 1000;

  it("handles invalid data gracefully", () => {
    expect(getLastContractionStart(), "undefined array").toBe(emptyTime);
    expect(getLastContractionStart([]), "empty array").toBe(emptyTime);
  });

  it("handles normal data", () => {
    expect(
      getLastContractionStart([{ id: 1, start }]),
      "contraction no end",
    ).toBe(new Date(start).toLocaleTimeString());

    expect(
      getLastContractionStart([{ id: 1, start, end }]),
      "one contraction",
    ).toBe(new Date(start).toLocaleTimeString());

    expect(
      getLastContractionStart([...contractions, { id: 1, start, end }]),
      "many contractions",
    ).toBe(new Date(start).toLocaleTimeString());
  });
});
