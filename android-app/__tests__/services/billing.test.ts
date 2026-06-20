import { getProductDisplayInfo } from '../../src/services/billing';
import { BILLING_PRODUCTS } from '../../src/utils/constants';

describe('Billing Service', () => {
  describe('getProductDisplayInfo', () => {
    it('returns Core Gym info', () => {
      const info = getProductDisplayInfo(BILLING_PRODUCTS.CORE_GYM_MONTHLY);
      expect(info.name).toBe('Core Gym');
      expect(info.features.length).toBeGreaterThan(0);
      expect(info.recommended).toBe(false);
    });

    it('returns Full Bundle info with recommended flag', () => {
      const info = getProductDisplayInfo(BILLING_PRODUCTS.FULL_BUNDLE_MONTHLY);
      expect(info.name).toBe('Full Bundle');
      expect(info.recommended).toBe(true);
      expect(info.features).toContain('Everything in Core Gym');
    });

    it('returns Articulation add-on info', () => {
      const info = getProductDisplayInfo(BILLING_PRODUCTS.ARTICULATION_ADDON);
      expect(info.name).toBe('Articulation Add-on');
    });

    it('returns IntroProfiles add-on info', () => {
      const info = getProductDisplayInfo(BILLING_PRODUCTS.INTROPROFILES_ADDON);
      expect(info.name).toBe('IntroProfiles Add-on');
    });

    it('handles unknown product IDs', () => {
      const info = getProductDisplayInfo('unknown.product');
      expect(info.name).toBe('Unknown');
      expect(info.features).toEqual([]);
    });
  });

  describe('BILLING_PRODUCTS', () => {
    it('has correct product IDs', () => {
      expect(BILLING_PRODUCTS.CORE_GYM_MONTHLY).toContain('core_gym');
      expect(BILLING_PRODUCTS.FULL_BUNDLE_MONTHLY).toContain('full_bundle');
      expect(BILLING_PRODUCTS.ARTICULATION_ADDON).toContain('articulation');
      expect(BILLING_PRODUCTS.INTROPROFILES_ADDON).toContain('introprofiles');
    });

    it('all use com.bishopshop.peitho prefix', () => {
      for (const id of Object.values(BILLING_PRODUCTS)) {
        expect(id).toMatch(/^com\.bishopshop\.peitho\./);
      }
    });
  });
});
