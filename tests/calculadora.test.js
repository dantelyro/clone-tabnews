const calculadora = require("../models/calculadora");

test("somar 2 + 2 deveria retornar 4", () => {
  const result = calculadora.somar(2, 2);

  expect(result).toBe(4);
});

test("soma 100 + 5 deveria retornar 105", () => {
  const result = calculadora.somar(100, 5);

  expect(result).toBe(105);
});

test("soma Banana + 100 deveria retornar Error", () => {
  const result = calculadora.somar("Banana", 100);

  expect(result).toBe("Error");
});

test("se não for enviado argumento deveria retornar Error", () => {
  const result = calculadora.somar();

  expect(result).toBe("Error");
});
