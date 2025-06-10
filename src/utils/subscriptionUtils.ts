
export const getAdTypeFromPlan = (currentPlan: any) => {
  switch (currentPlan?.adType) {
    case 'top':
      return 'premium';
    case 'super':
      return 'featured';
    case 'vip':
      return 'diamond';
    default:
      return 'normal';
  }
};
