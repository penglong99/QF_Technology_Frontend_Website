import { getPageItems } from './getPageItems';

describe('getPageItems', () => {
  it('lists every page when there are few pages', () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('matches the Figma pattern on the first page', () => {
    expect(getPageItems(1, 12)).toEqual([1, 2, 3, 4, 'ellipsis', 12]);
  });

  it('shows ellipses on both sides of a middle page', () => {
    expect(getPageItems(6, 12)).toEqual([1, 'ellipsis', 5, 6, 7, 'ellipsis', 12]);
  });

  it('handles the last page', () => {
    expect(getPageItems(12, 12)).toEqual([1, 'ellipsis', 9, 10, 11, 12]);
  });
});
