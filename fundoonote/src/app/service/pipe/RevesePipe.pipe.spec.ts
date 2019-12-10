import { ReversePipe } from './ReversePipe.pipe';

describe('DatetimePipe', () => {
  it('create an instance', () => {
    const pipe = new ReversePipe();
    expect(pipe).toBeTruthy();
  });
});
