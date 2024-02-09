'use client';

import { SkeletonLoader } from '@webb-tools/webb-ui-components';
import type { PropsOf } from '@webb-tools/webb-ui-components/types';
import type { ElementRef } from 'react';
import { FC, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import Identity from '../../components/Identity';
import useActiveAccountAddress from '../../hooks/useActiveAccountAddress';
import Actions from './Actions';
import TotalBalance from './TotalBalance';

const AccountSummaryCard = forwardRef<ElementRef<'div'>, PropsOf<'div'>>(
  ({ className, ...props }, ref) => {
    const activeAccountAddress = useActiveAccountAddress();

    return (
      <div
        {...props}
        className={twMerge(
          'relative rounded-2xl border-2 p-6',
          'border-mono-0 bg-mono-0/70 dark:border-mono-160 dark:bg-mono-0/5',
          'dark:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]',
          'w-full flex items-center md:max-w-[556px] overflow-hidden',
          className
        )}
        ref={ref}
      >
        <div className="space-y-6 w-full">
          <header>
            {activeAccountAddress !== null ? (
              <Identity
                address={activeAccountAddress}
                fontWeight="normal"
                label="Address:"
                iconTooltipContent="Account public key"
              />
            ) : (
              <SkeletonLoader size="lg" />
            )}
          </header>

          <TotalBalance />

          <Actions />
        </div>

        <Logo className="absolute top-[50%] translate-y-[-50%] right-0 translate-x-[30%] rounded-br-2xl" />
      </div>
    );
  }
);

AccountSummaryCard.displayName = AccountSummaryCard.name;

/** @internal */
const Logo: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={twMerge('pointer-events-none', className)}>
      <svg
        width="270"
        height="236"
        viewBox="0 0 270 236"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.4" clipPath="url(#clip0_3096_32868)">
          <path
            className="fill-mono-100 dark:fill-[#D3D8E2]"
            d="M269.894 185.09C269.906 171.61 263.784 158.677 252.872 149.13C241.96 139.582 227.15 134.201 211.693 134.166L147.163 134.166C146.757 128.922 146.501 123.559 146.501 118C146.501 112.441 146.246 107.105 145.885 101.834L211.693 101.834C227.016 101.62 241.629 96.1608 252.378 86.6353C263.128 77.1099 269.152 64.2812 269.152 50.917C269.152 37.5527 263.128 24.7241 252.378 15.1987C241.629 5.67319 227.016 0.214431 211.693 -2.54403e-06L57.4638 -9.2856e-06C42.1405 0.214423 27.5279 5.67318 16.7786 15.1986C6.02925 24.7241 0.00476174 37.5527 0.00476116 50.917C0.00476057 64.2812 6.02925 77.1099 16.7786 86.6353C27.5279 96.1608 42.1405 101.62 57.4638 101.834L118.078 103.25C122.296 103.25 122.656 112.441 122.656 118C122.656 123.559 122.911 128.895 123.272 134.166L57.4638 134.166C42.1405 134.38 27.5279 139.839 16.7786 149.365C6.02925 158.89 0.00475588 171.719 0.00475529 185.083C0.00475471 198.447 6.02924 211.276 16.7786 220.801C27.5279 230.327 42.1405 235.786 57.4638 236L211.693 236C227.148 235.965 241.955 230.585 252.867 221.041C263.778 211.496 269.902 198.567 269.894 185.09ZM246.048 50.9104C246.052 58.8656 242.437 66.4972 235.996 72.1309C229.556 77.7646 220.815 80.9403 211.693 80.9611L143.359 80.9611C140.883 66.064 136.167 51.5165 129.331 37.6944C126.317 31.7057 122.458 26.0681 117.844 20.9122L211.693 20.9122C220.805 20.933 229.536 24.1015 235.975 29.7239C242.414 35.3462 246.036 42.9644 246.048 50.9104ZM57.4638 80.9611C48.3244 80.9611 39.5593 77.7951 33.0967 72.1595C26.6342 66.5239 23.0035 58.8804 23.0035 50.9104C23.0035 42.9405 26.6342 35.297 33.0967 29.6614C39.5593 24.0258 48.3244 20.8598 57.4638 20.8598L72.9348 20.8598C86.6017 20.8598 99.5468 30.2998 107.606 46.1249C113.122 57.2755 117.046 68.9754 119.288 80.9611L57.4638 80.9611ZM23.1088 185.09C23.1048 177.134 26.7196 169.503 33.1603 163.869C39.601 158.235 48.3414 155.06 57.4638 155.039L125.798 155.039C128.273 169.936 132.99 184.483 139.826 198.306C142.84 204.294 146.698 209.932 151.312 215.088L57.4638 215.088C48.3518 215.067 39.6205 211.899 33.1815 206.276C26.7426 200.654 23.1207 193.036 23.1088 185.09ZM161.641 189.875C156.125 178.724 152.201 167.025 149.959 155.039L211.693 155.039C220.832 155.039 229.598 158.205 236.06 163.841C242.523 169.476 246.153 177.12 246.153 185.09C246.153 193.059 242.523 200.703 236.06 206.339C229.598 211.974 220.832 215.14 211.693 215.14L196.222 215.14C182.615 215.14 169.67 205.7 161.641 189.875Z"
            fillOpacity="0.1"
          />
          <path
            opacity="0.8"
            d="M269.893 50.9105C269.905 64.3899 263.783 77.3228 252.871 86.8702C241.959 96.4175 227.149 101.799 211.691 101.834L147.16 101.834C146.754 107.078 146.498 112.441 146.498 118C146.498 123.559 146.242 128.895 145.882 134.166L211.691 134.166C227.015 134.38 241.627 139.839 252.377 149.365C263.126 158.89 269.151 171.719 269.151 185.083C269.151 198.447 263.126 211.276 252.377 220.801C241.627 230.327 227.015 235.786 211.691 236L57.459 236C42.1354 235.786 27.5226 230.327 16.7731 220.801C6.02359 211.276 -0.00100663 198.447 -0.00100647 185.083C-0.00100631 171.719 6.02359 158.89 16.7731 149.365C27.5226 139.839 42.1354 134.38 57.459 134.166L118.075 132.75C122.292 132.75 122.652 123.559 122.652 118C122.652 112.441 122.908 107.105 123.268 101.834L57.459 101.834C42.1354 101.62 27.5226 96.1608 16.7731 86.6354C6.0236 77.1099 -0.00100504 64.2813 -0.00100488 50.917C-0.00100472 37.5528 6.0236 24.7241 16.7731 15.1987C27.5226 5.67322 42.1355 0.21443 57.459 -2.53773e-06L211.691 -6.95276e-07C227.146 0.0347238 241.954 5.41466 252.865 14.9592C263.777 24.5038 269.901 37.4333 269.893 50.9105ZM246.047 185.09C246.051 177.134 242.436 169.503 235.995 163.869C229.554 158.235 220.814 155.06 211.691 155.039L143.356 155.039C140.88 169.936 136.164 184.483 129.328 198.306C126.314 204.294 122.455 209.932 117.841 215.088L211.691 215.088C220.803 215.067 229.535 211.899 235.974 206.276C242.413 200.654 246.035 193.036 246.047 185.09ZM57.459 155.039C48.3195 155.039 39.5542 158.205 33.0915 163.841C26.6289 169.476 22.9982 177.12 22.9982 185.09C22.9982 193.059 26.6289 200.703 33.0915 206.339C39.5542 211.974 48.3195 215.14 57.459 215.14L72.9303 215.14C86.5974 215.14 99.5428 205.7 107.602 189.875C113.118 178.724 117.042 167.025 119.284 155.039L57.459 155.039ZM23.1034 50.9105C23.0994 58.8656 26.7143 66.4972 33.1551 72.1309C39.5959 77.7646 48.3365 80.9403 57.459 80.9611L125.794 80.9611C128.27 66.064 132.986 51.5165 139.822 37.6944C142.836 31.7057 146.695 26.0682 151.309 20.9122L57.459 20.9122C48.3469 20.933 39.6154 24.1015 33.1764 29.7239C26.7373 35.3462 23.1153 42.9644 23.1034 50.9105ZM161.639 46.1249C156.122 57.2756 152.198 68.9754 149.956 80.9611L211.691 80.9611C220.831 80.9611 229.596 77.7951 236.058 72.1595C242.521 66.5239 246.152 58.8804 246.152 50.9105C246.152 42.9405 242.521 35.297 236.058 29.6614C229.596 24.0258 220.831 20.8598 211.691 20.8598L196.22 20.8598C182.613 20.8598 169.667 30.2998 161.639 46.1249Z"
            fillOpacity="0.1"
          />
        </g>
        <defs>
          <clipPath id="clip0_3096_32868">
            <rect
              width="236"
              height="269.894"
              fill="white"
              transform="translate(269.894) rotate(90)"
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default AccountSummaryCard;
