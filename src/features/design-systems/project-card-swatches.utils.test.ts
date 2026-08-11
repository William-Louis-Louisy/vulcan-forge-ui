import { describe, expect, it } from 'vitest';

import { createProjectCardSwatches } from './project-card-swatches.utils';

describe('createProjectCardSwatches', () => {
  it('returns fallback swatches when no palette data is provided', () => {
    expect(
      createProjectCardSwatches({
        tokenSets: [],
        themes: [],
      }),
    ).toEqual(['#ffffff', '#070707', '#FF8731', '#586644']);
  });

  it('derives swatches from stable light theme roles instead of token names', () => {
    expect(
      createProjectCardSwatches({
        tokenSets: [
          {
            tokens: [
              { path: 'palette.canvas', value: '#101114' },
              { path: 'palette.panel', value: '#181A20' },
              { path: 'palette.brand', value: '#E45D24' },
              { path: 'palette.ink', value: '#F5F2EC' },
            ],
          },
        ],
        themes: [
          {
            mode: 'light',
            tokens: {
              color: {
                background: '{palette.canvas}',
                surface: '{palette.panel}',
                accent: '{palette.brand}',
                content: '{palette.ink}',
              },
            },
          },
        ],
      }),
    ).toEqual(['#101114', '#181A20', '#E45D24', '#F5F2EC']);
  });

  it('prefers the light theme when multiple themes exist', () => {
    expect(
      createProjectCardSwatches({
        tokenSets: [],
        themes: [
          {
            mode: 'dark',
            tokens: {
              color: {
                background: '#090909',
                surface: '#111111',
                accent: '#CC5500',
                content: '#FFFFFF',
              },
            },
          },
          {
            mode: 'light',
            tokens: {
              color: {
                background: '#FAFAFA',
                surface: '#FFFFFF',
                accent: '#FF8731',
                content: '#111111',
              },
            },
          },
        ],
      }),
    ).toEqual(['#FAFAFA', '#FFFFFF', '#FF8731', '#111111']);
  });

  it('keeps the palette stable when token paths and theme references are renamed together', () => {
    const beforeRename = createProjectCardSwatches({
      tokenSets: [
        {
          tokens: [
            { path: 'color.semantic.background.app', value: '#121212' },
            { path: 'color.surface', value: '#202020' },
            { path: 'color.semantic.action.primary', value: '#FF8731' },
            { path: 'color.content', value: '#F7F7F7' },
          ],
        },
      ],
      themes: [
        {
          mode: 'light',
          tokens: {
            color: {
              background: '{color.semantic.background.app}',
              surface: '{color.surface}',
              accent: '{color.semantic.action.primary}',
              content: '{color.content}',
            },
          },
        },
      ],
    });

    const afterRename = createProjectCardSwatches({
      tokenSets: [
        {
          tokens: [
            { path: 'brand.canvas', value: '#121212' },
            { path: 'brand.surface', value: '#202020' },
            { path: 'brand.action', value: '#FF8731' },
            { path: 'brand.content', value: '#F7F7F7' },
          ],
        },
      ],
      themes: [
        {
          mode: 'light',
          tokens: {
            color: {
              background: '{brand.canvas}',
              surface: '{brand.surface}',
              accent: '{brand.action}',
              content: '{brand.content}',
            },
          },
        },
      ],
    });

    expect(afterRename).toEqual(beforeRename);
  });

  it('uses available resolved token colors before static fallbacks when a theme role is missing', () => {
    expect(
      createProjectCardSwatches({
        tokenSets: [
          {
            tokens: [
              { path: 'palette.one', value: '#111111' },
              { path: 'palette.two', value: '#222222' },
              { path: 'palette.alias', value: '{palette.two}' },
            ],
          },
        ],
        themes: [],
      }),
    ).toEqual(['#111111', '#222222', '#FF8731', '#586644']);
  });
});
