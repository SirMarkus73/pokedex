import { type PokemonAPIResponseAll } from "../types/allpokemons";
import { type PokemonAPIResponse } from "../types/individualpokemon";

interface Types {
  slot: number;
  type: string;
  url: string;
}

export async function getPokemons(
  offset: number = 0,
  quantity: number | "all" = 15
) {
  if (quantity === "all") {
    quantity = 1302;
  }

  const API_URL = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${quantity}`;
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Request Fail");
  }

  const { results: pokemons } =
    (await response.json()) as PokemonAPIResponseAll;
  return pokemons;
}

export async function getPokemonByName(pokemonName: string) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );

  if (!response.ok) {
    throw new Error("Request Fail");
  }

  const { id, name, height, sprites, types } =
    (await response.json()) as PokemonAPIResponse;

  let allTypes: Types[] = [];
  types.map((type) => {
    allTypes.push({
      slot: type.slot,
      type: type.type.name,
      url: type.type.url,
    });
  });

  return {
    id,
    name,
    height,
    sprites,
    allTypes,
  };
}

export async function getPokemonNameStaticPaths() {
  let staticPaths: object[] = [];
  const pokemons = await getPokemons(0, "all");
  pokemons.map((pokemon) => {
    staticPaths.push({
      params: {
        name: pokemon.name,
      },
    });
  });

  return staticPaths;
}

export async function getPokemonOffsetStaticPaths() {
  const pokemons = await getPokemons(0, "all");
  let staticPaths: object[] = [];
  pokemons.map((pokemon) => {
    staticPaths.push({
      params: {
        name: pokemon.name,
      },
    });
  });
}
