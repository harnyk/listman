import { useDependencies } from './useDependencies';

export function useCheckout() {
    const { checkoutService } = useDependencies();

    return checkoutService;
}
