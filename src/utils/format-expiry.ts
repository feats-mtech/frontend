export const getDaysLeft = (expiryDate: string): number => {
  const currentDate = new Date();
  const expiry = new Date(expiryDate);

  // Calculate the difference in time
  const timeDiff = expiry.getTime() - currentDate.getTime();

  // Convert time difference from milliseconds to days
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return Math.max(daysLeft, 0);
};
