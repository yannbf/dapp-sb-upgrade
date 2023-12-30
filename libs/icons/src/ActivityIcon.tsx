import { createIcon } from './create-icon';
import { IconBase } from './types';

const ActivityIcon = (props: IconBase) => {
  return createIcon({
    ...props,
    width: 16,
    height: 16,
    viewBox: '0 0 16 16',
    d: 'M6 2c.306 0 .582.187.696.471L10 10.731l1.304-3.26A.751.751 0 0 1 12 7h3.25a.75.75 0 0 1 0 1.5h-2.742l-1.812 4.528a.751.751 0 0 1-1.392 0L6 4.77 4.696 8.03A.75.75 0 0 1 4 8.5H.75a.75.75 0 0 1 0-1.5h2.742l1.812-4.529A.751.751 0 0 1 6 2Z',
    displayName: 'ActivityIcon',
  });
};

export default ActivityIcon;
