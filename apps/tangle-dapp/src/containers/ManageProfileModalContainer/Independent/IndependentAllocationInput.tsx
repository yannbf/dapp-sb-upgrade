import { BN } from '@polkadot/util';
import { TANGLE_TOKEN_DECIMALS } from '@webb-tools/dapp-config/constants/tangle';
import { Close, LockLineIcon } from '@webb-tools/icons';
import useNetworkStore from '@webb-tools/tangle-shared-ui/context/useNetworkStore';
import { Chip, Input, SkeletonLoader } from '@webb-tools/webb-ui-components';
import { FC, useCallback, useMemo, useState } from 'react';

import InputWrapper from '../../../components/InputWrapper';
import useInputAmount from '../../../hooks/useInputAmount';
import { RestakingService } from '../../../types';
import { getChipColorOfServiceType } from '../../../utils';
import formatTangleBalance from '../../../utils/formatTangleBalance';
import InputAction from '../InputAction';
import {
  ERROR_MIN_RESTAKING_BOND,
  ERROR_NOT_ENOUGH_BALANCE,
} from '../constants';

export type IndependentAllocationInputProps = {
  amount: BN | null;
  setAmount: (newAmount: BN | null) => void;
  availableServices: RestakingService[];
  availableBalance: BN | null;
  service: RestakingService | null;
  id: string;
  validate?: boolean;
  errorOnEmptyValue?: boolean;
  onDelete?: (service: RestakingService) => void;
  setService?: (service: RestakingService) => void;
};

/**
 * A specialized input used to allocate roles for creating or
 * updating job profiles in Substrate.
 */
const IndependentAllocationInput: FC<IndependentAllocationInputProps> = ({
  amount = null,
  setAmount,
  availableBalance,
  availableServices,
  validate = true,
  id,
  service,
  setService,
  onDelete,
  errorOnEmptyValue = true,
}) => {
  const { nativeTokenSymbol } = useNetworkStore();

  // TODO: This is misleading, because it defaults to `false` when `servicesWithJobs` is still loading. It needs to default to `null` and have its loading state handled appropriately.
  const hasActiveJob = false;

  const substrateAllocationAmount = null;
  const min = substrateAllocationAmount;

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const minErrorMessage = hasActiveJob
    ? 'Cannot decrease restake amount for an active role'
    : ERROR_MIN_RESTAKING_BOND;

  const {
    displayAmount: amountString,
    errorMessage,
    handleChange,
  } = useInputAmount({
    amount,
    min,
    max: availableBalance,
    decimals: TANGLE_TOKEN_DECIMALS,
    errorOnEmptyValue,
    setAmount,
    minErrorMessage,
    maxErrorMessage: ERROR_NOT_ENOUGH_BALANCE,
  });

  const handleDelete = useCallback(() => {
    if (onDelete !== undefined && service !== null) {
      onDelete(service);
    }
  }, [onDelete, service]);

  const handleSetService = useCallback(
    (service: RestakingService) => {
      if (setService === undefined) {
        return;
      }

      setService(service);
      setIsDropdownVisible(false);
    },
    [setService],
  );

  const dropdownBody = useMemo(
    () =>
      availableServices
        .filter((availableRole) => availableRole !== service)
        // Sort roles in ascending order, by their display
        // values (strings). This is done with the intent to
        // give priority to the TSS roles.
        .toSorted((a, b) => a.localeCompare(b))
        .map((service) => (
          <div
            key={service}
            onClick={() => handleSetService(service)}
            className="flex justify-between p-2 rounded-lg cursor-pointer hover:bg-mono-20 dark:hover:bg-mono-160"
          >
            <Chip color={getChipColorOfServiceType(service)}>{service}</Chip>

            {min !== null ? (
              <Chip color="dark-grey" className="text-mono-0 dark:text-mono-0">
                {`≥ ${formatTangleBalance(min)}`}
              </Chip>
            ) : (
              <SkeletonLoader />
            )}
          </div>
        )),
    [availableServices, handleSetService, min, service],
  );

  // Users can remove roles only if there are no active services
  // linked to those roles.
  const canBeDeleted = !hasActiveJob && onDelete !== undefined;

  const actions = (
    <>
      {hasActiveJob && (
        <InputAction
          tooltip={
            'Active service(s) in progress; can only have restake amount increased.'
          }
          Icon={LockLineIcon}
          iconSize="md"
        />
      )}

      {canBeDeleted && (
        <InputAction
          Icon={Close}
          onClick={handleDelete}
          tooltip="Remove role"
        />
      )}
    </>
  );

  const hasDropdownBody = !hasActiveJob && setService !== undefined;

  return (
    <InputWrapper
      id={id}
      isDropdownVisible={isDropdownVisible}
      setIsDropdownVisible={setIsDropdownVisible}
      title="Total Restake"
      actions={actions}
      dropdownBody={hasDropdownBody ? dropdownBody : undefined}
      errorMessage={validate ? (errorMessage ?? undefined) : undefined}
      chipText={service ?? 'Select role'}
      chipColor={
        service !== null ? getChipColorOfServiceType(service) : undefined
      }
    >
      <Input
        id={id}
        inputClassName="placeholder:text-md"
        value={amountString}
        onChange={handleChange}
        type="text"
        placeholder={`0 ${nativeTokenSymbol}`}
        size="sm"
        autoComplete="off"
        isInvalid={errorMessage !== undefined}
        // Disable input if the available balance is not yet loaded.
        isReadOnly={availableBalance === null}
        isControlled
      />
    </InputWrapper>
  );
};

export default IndependentAllocationInput;
