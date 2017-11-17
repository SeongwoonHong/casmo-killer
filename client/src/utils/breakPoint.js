export default function (width) {
  if (width <= 575) {
    return 'xs';
  } else if (width > 575 && width <= 767) {
    return 'sm';
  } else if (width > 767 && width <= 991) {
    return 'md';
  } else if (width > 991 && width <= 1199) {
    return 'lg';
  } else if (width > 1199) {
    return 'xl';
  }
}
