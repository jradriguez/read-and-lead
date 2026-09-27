import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { View } from "react-native";
import { WordBuilder } from "../../src/features/lesson/WordBuilder";
// Drive the drop boundary; native gesture delivery is checked separately.
jest.mock("../../src/features/lesson/LetterTile", () => ({
  LetterTile: ({
    id,
    onDrop,
  }: {
    id: string;
    onDrop: (x: number, y: number) => void;
  }) => {
    const { createElement } = jest.requireActual("react");
    const { Pressable } = jest.requireActual("react-native");
    return createElement(Pressable, {
      testID: `drop-${id}`,
      onPress: () => onDrop(20, 20),
    });
  },
}));
import { makeCatalog } from "../fixtures/catalog";

test("a delayed drop cannot place a tile after inputs become disabled", async () => {
  const measurements: ((x: number, y: number, w: number, h: number) => void)[] =
    [];
  const measure = jest
    .spyOn(View.prototype, "measureInWindow")
    .mockImplementation((cb) => {
      measurements.push(cb);
    });
  const onPlace = jest.fn();
  const props = {
    choices: makeCatalog().patterns.slice(0, 3),
    slots: [null, null],
    selected: null,
    onSelect: jest.fn(),
    onPlace,
    disabled: false,
  };
  try {
    const result = await render(<WordBuilder {...props} />);
    await fireEvent.press(screen.getByTestId("drop-m"));
    await result.rerender(<WordBuilder {...props} disabled />);
    await act(() =>
      measurements.forEach((callback, i) => callback(i * 100, 0, 80, 100)),
    );
    expect(onPlace).not.toHaveBeenCalled();
  } finally {
    measure.mockRestore();
  }
});

test.each(["unmount", "activity change", "newer drop"])(
  "a delayed drop is discarded after %s",
  async (reason) => {
    const measurements: ((
      x: number,
      y: number,
      w: number,
      h: number,
    ) => void)[] = [];
    const measure = jest
      .spyOn(View.prototype, "measureInWindow")
      .mockImplementation((cb) => {
        measurements.push(cb);
      });
    const onPlace = jest.fn();
    const props = {
      choices: makeCatalog().patterns.slice(0, 3),
      slots: [null, null],
      selected: null,
      onSelect: jest.fn(),
      onPlace,
      disabled: false,
    };
    try {
      const result = await render(<WordBuilder {...props} />);
      await fireEvent.press(screen.getByTestId("drop-m"));
      if (reason === "unmount") await result.unmount();
      else if (reason === "activity change")
        await result.rerender(
          <WordBuilder {...props} slots={[null, null, null]} />,
        );
      else await fireEvent.press(screen.getByTestId("drop-s"));
      await act(() =>
        measurements.slice(0, 2).forEach((cb, i) => cb(i * 100, 0, 80, 100)),
      );
      expect(onPlace).not.toHaveBeenCalled();
      if (reason === "newer drop") {
        await act(() => {
          measurements[3](100, 0, 80, 100);
          measurements[2](0, 0, 80, 100);
        });
        expect(onPlace).toHaveBeenCalledTimes(1);
        expect(onPlace).toHaveBeenCalledWith("s", 0);
      }
    } finally {
      measure.mockRestore();
    }
  },
);

test("drop waits for every measurement and rejects empty bounds", async () => {
  const measurements: ((x: number, y: number, w: number, h: number) => void)[] =
    [];
  const measure = jest
    .spyOn(View.prototype, "measureInWindow")
    .mockImplementation((cb) => {
      measurements.push(cb);
    });
  const onPlace = jest.fn();
  try {
    await render(
      <WordBuilder
        choices={makeCatalog().patterns.slice(0, 3)}
        slots={[null, null]}
        selected={null}
        onSelect={() => {}}
        onPlace={onPlace}
        disabled={false}
      />,
    );
    await fireEvent.press(screen.getByTestId("drop-m"));
    await act(() => measurements[1](100, 0, 80, 100));
    expect(onPlace).not.toHaveBeenCalled();
    await act(() => measurements[0](0, 0, 0, 0));
    expect(onPlace).not.toHaveBeenCalled();
  } finally {
    measure.mockRestore();
  }
});
