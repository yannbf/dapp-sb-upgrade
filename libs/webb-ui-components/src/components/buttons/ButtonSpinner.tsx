import Spinner from '@webb-tools/icons/Spinner';
import { type FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { ButtonSpinnerProps } from './types';

const ButtonSpinner: FC<ButtonSpinnerProps> = (props) => {
  const {
    children = <Spinner darkMode={props.darkMode} className="w-5 h-5" />,
    className,
    hasLabel = false,
    placement = 'start',
  } = props;

  const mergedClassName = twMerge(
    'flex items-center',
    hasLabel ? 'relative' : 'absolute',
    hasLabel ? (placement === 'start' ? `mr-2` : `ml-2`) : undefined,
    className,
  );

  return <div className={mergedClassName}>{children}</div>;
};

export default ButtonSpinner;
