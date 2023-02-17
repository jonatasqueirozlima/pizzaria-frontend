import { useRadioGroup, Wrap } from "@chakra-ui/react";

import useBorderType from "@/store/pizza/useBorderType";

import RadioCard from "./RadioCard";

export default function PizzaBorderRadio() {
  const options = ["catupiry", "cheddar", "none"];
  const { setBorderType } = useBorderType();

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "pizza-border-type",
    defaultValue: "catupiry",
    onChange: setBorderType,
  });

  const group = getRootProps();

  return (
    <Wrap {...group} spacing={4}>
      {options.map((value) => (
        <RadioCard
          key={value}
          inputValue={value === "none" ? "sem borda" : value}
          {...getRadioProps({ value })}
        />
      ))}
    </Wrap>
  );
}
