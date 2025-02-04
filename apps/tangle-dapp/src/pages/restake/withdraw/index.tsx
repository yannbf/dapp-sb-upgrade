import { Cross1Icon } from '@radix-ui/react-icons';
import { useWebContext } from '@webb-tools/api-provider-environment/webb-context';
import { ZERO_BIG_INT } from '@webb-tools/dapp-config/constants';
import { calculateTypedChainId } from '@webb-tools/dapp-types/TypedChainId';
import isDefined from '@webb-tools/dapp-types/utils/isDefined';
import { ChainIcon } from '@webb-tools/icons/ChainIcon';
import LockFillIcon from '@webb-tools/icons/LockFillIcon';
import { LockLineIcon } from '@webb-tools/icons/LockLineIcon';
import { useRestakeContext } from '@webb-tools/tangle-shared-ui/context/RestakeContext';
import useRestakeDelegatorInfo from '@webb-tools/tangle-shared-ui/data/restake/useRestakeDelegatorInfo';
import {
  Card,
  IconButton,
  useBreakpointValue,
} from '@webb-tools/webb-ui-components';
import Button from '@webb-tools/webb-ui-components/components/buttons/Button';
import { Modal } from '@webb-tools/webb-ui-components/components/Modal';
import type { TextFieldInputProps } from '@webb-tools/webb-ui-components/components/TextField/types';
import { TransactionInputCard } from '@webb-tools/webb-ui-components/components/TransactionInputCard';
import { useModal } from '@webb-tools/webb-ui-components/hooks/useModal';
import { Typography } from '@webb-tools/webb-ui-components/typography/Typography';
import cx from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { formatUnits, parseUnits } from 'viem';
import ErrorMessage from '../../../components/ErrorMessage';
import RestakeDetailCard from '../../../components/RestakeDetailCard';
import { SUPPORTED_RESTAKE_DEPOSIT_TYPED_CHAIN_IDS } from '../../../constants/restake';
import {
  type ScheduleWithdrawContext,
  TxEvent,
} from '../../../data/restake/RestakeTx/base';
import useRestakeTx from '../../../data/restake/useRestakeTx';
import type { Props } from '../../../data/restake/useRestakeTxEventHandlersWithNoti';
import useRestakeTxEventHandlersWithNoti from '../../../data/restake/useRestakeTxEventHandlersWithNoti';
import ViewTxOnExplorer from '../../../data/restake/ViewTxOnExplorer';
import useActiveTypedChainId from '../../../hooks/useActiveTypedChainId';
import type { WithdrawFormFields } from '../../../types/restake';
import decimalsToStep from '../../../utils/decimalsToStep';
import { getAmountValidation } from '../../../utils/getAmountValidation';
import ActionButtonBase from '../ActionButtonBase';
import { AnimatedTable } from '../AnimatedTable';
import AssetPlaceholder from '../AssetPlaceholder';
import { ExpandTableButton } from '../ExpandTableButton';
import RestakeTabs from '../RestakeTabs';
import StyleContainer from '../StyleContainer';
import SupportedChainModal from '../SupportedChainModal';
import useSwitchChain from '../useSwitchChain';
import TxInfo from './TxInfo';
import WithdrawModal from './WithdrawModal';
import WithdrawRequestTable from './WithdrawRequestTable';

const Page = () => {
  const {
    register,
    setValue: setFormValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<WithdrawFormFields>({
    mode: 'onBlur',
  });

  const switchChain = useSwitchChain();
  const activeTypedChainId = useActiveTypedChainId();
  const { activeChain } = useWebContext();
  const { assetMap } = useRestakeContext();

  const {
    status: isWithdrawModalOpen,
    open: openWithdrawModal,
    close: closeWithdrawModal,
  } = useModal();

  const {
    status: isChainModalOpen,
    open: openChainModal,
    close: closeChainModal,
  } = useModal();

  const [isWithdrawRequestTableOpen, setIsWithdrawRequestTableOpen] =
    useState(false);

  const isMediumScreen = useBreakpointValue('md', true, false);

  // Register form fields on mount
  useEffect(() => {
    register('assetId', { required: true });
  }, [register]);

  // Reset form when active chain changes
  useEffect(() => {
    reset();
  }, [activeTypedChainId, reset]);

  const { delegatorInfo } = useRestakeDelegatorInfo();

  const selectedAssetId = watch('assetId');
  const amount = watch('amount');

  const withdrawRequests = useMemo(() => {
    if (!delegatorInfo?.withdrawRequests) return [];

    return delegatorInfo.withdrawRequests;
  }, [delegatorInfo?.withdrawRequests]);

  const selectedAsset = useMemo(() => {
    if (!selectedAssetId) return null;
    if (!assetMap[selectedAssetId]) return null;

    return assetMap[selectedAssetId];
  }, [assetMap, selectedAssetId]);

  const { maxAmount, formattedMaxAmount } = useMemo(
    () => {
      if (!delegatorInfo?.deposits) return {};

      const depositedAsset = Object.entries(delegatorInfo.deposits).find(
        ([assetId]) => assetId === selectedAssetId,
      );

      if (!depositedAsset) return {};
      if (!assetMap[depositedAsset[0]]) return {};

      const assetId = depositedAsset[0];
      const maxAmount = depositedAsset[1].amount;
      const formattedMaxAmount = Number(
        formatUnits(maxAmount, assetMap[assetId].decimals),
      );

      return {
        maxAmount,
        formattedMaxAmount,
      };
    },
    // prettier-ignore
    [assetMap, delegatorInfo?.deposits, selectedAssetId],
  );

  const customAmountProps = useMemo<TextFieldInputProps>(() => {
    const step = decimalsToStep(selectedAsset?.decimals);

    return {
      type: 'number',
      step,
      ...register('amount', {
        required: 'Amount is required',
        validate: getAmountValidation(
          step,
          step,
          ZERO_BIG_INT,
          maxAmount,
          selectedAsset?.decimals,
          selectedAsset?.symbol,
        ),
      }),
    };
  }, [maxAmount, register, selectedAsset?.decimals, selectedAsset?.symbol]);

  const displayError = useMemo(() => {
    return errors.assetId !== undefined || !selectedAssetId
      ? 'Select an asset'
      : !amount
        ? 'Enter an amount'
        : errors.amount !== undefined
          ? 'Invalid amount'
          : undefined;
  }, [errors.assetId, errors.amount, selectedAssetId, amount]);

  const options = useMemo<Props<ScheduleWithdrawContext>>(() => {
    return {
      options: {
        [TxEvent.SUCCESS]: {
          secondaryMessage: ({ amount, assetId }, explorerUrl) => (
            <ViewTxOnExplorer url={explorerUrl}>
              Successfully scheduled withdraw of{' '}
              {formatUnits(amount, assetMap[assetId].decimals)}{' '}
              {assetMap[assetId].symbol}{' '}
            </ViewTxOnExplorer>
          ),
        },
      },
      onTxSuccess: () => reset(),
    };
  }, [assetMap, reset]);

  const { scheduleWithdraw } = useRestakeTx();
  const txEventHandlers = useRestakeTxEventHandlersWithNoti(options);

  const onSubmit = useCallback<SubmitHandler<WithdrawFormFields>>(
    async (data) => {
      const { amount, assetId } = data;
      if (!assetId || !isDefined(assetMap[assetId])) {
        return;
      }

      const asset = assetMap[assetId];

      await scheduleWithdraw(
        assetId,
        parseUnits(amount, asset.decimals),
        txEventHandlers,
      );
    },
    [assetMap, scheduleWithdraw, txEventHandlers],
  );

  return (
    <div
      className={cx(
        'grid gap-4 place-content-center',
        !isMediumScreen ? 'grid-cols-1' : 'grid-flow-col auto-cols-fr',
      )}
    >
      <StyleContainer
        className={cx(
          isWithdrawRequestTableOpen && isMediumScreen
            ? 'ml-auto mr-0'
            : 'mx-auto',
        )}
      >
        <RestakeTabs />

        <Card withShadow className="relative">
          {!isWithdrawRequestTableOpen && isMediumScreen && (
            <ExpandTableButton
              className="absolute top-0 -right-10"
              tooltipContent="Open withdraw requests table"
              onClick={() => setIsWithdrawRequestTableOpen(true)}
            />
          )}

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <TransactionInputCard.Root tokenSymbol={selectedAsset?.symbol}>
              <TransactionInputCard.Header>
                <TransactionInputCard.ChainSelector
                  placeholder="Active Chain"
                  disabled
                  {...(activeChain
                    ? {
                        renderBody: () => (
                          <div className="flex items-center gap-2">
                            <ChainIcon size="lg" name={activeChain.name} />

                            <Typography
                              variant="h5"
                              fw="bold"
                              className="text-mono-200 dark:text-mono-0"
                            >
                              {activeChain.name}
                            </Typography>
                          </div>
                        ),
                      }
                    : {})}
                />
                <TransactionInputCard.MaxAmountButton
                  maxAmount={formattedMaxAmount}
                  tooltipBody="Deposited Balance"
                  Icon={
                    useRef({
                      enabled: <LockLineIcon />,
                      disabled: <LockFillIcon />,
                    }).current
                  }
                />
              </TransactionInputCard.Header>

              <TransactionInputCard.Body
                customAmountProps={customAmountProps}
                tokenSelectorProps={
                  useRef({
                    placeholder: <AssetPlaceholder />,
                    onClick: openWithdrawModal,
                  }).current
                }
              />

              <ErrorMessage>{errors.amount?.message}</ErrorMessage>
            </TransactionInputCard.Root>

            <TxInfo />

            <ActionButtonBase>
              {(isLoading, loadingText) => {
                const activeChainSupported =
                  isDefined(activeTypedChainId) &&
                  SUPPORTED_RESTAKE_DEPOSIT_TYPED_CHAIN_IDS.includes(
                    activeTypedChainId,
                  );

                if (!activeChainSupported) {
                  return (
                    <Button
                      isFullWidth
                      type="button"
                      isLoading={isLoading}
                      loadingText={loadingText}
                      onClick={openChainModal}
                    >
                      Switch to supported chain
                    </Button>
                  );
                }

                return (
                  <Button
                    isDisabled={!isValid || isDefined(displayError)}
                    type="submit"
                    isFullWidth
                    isLoading={isSubmitting || isLoading}
                    loadingText={
                      isSubmitting ? 'Sending transaction...' : loadingText
                    }
                  >
                    {displayError ?? 'Schedule Withdraw'}
                  </Button>
                );
              }}
            </ActionButtonBase>
          </form>
        </Card>
      </StyleContainer>

      <AnimatedTable
        isTableOpen={isWithdrawRequestTableOpen}
        isMediumScreen={isMediumScreen}
      >
        <RestakeDetailCard.Root className="md:mt-[61px]">
          <div className="flex items-center justify-between">
            <RestakeDetailCard.Header
              title={
                withdrawRequests.length > 0
                  ? 'Withdraw Requests'
                  : 'No Withdraw Requests'
              }
            />

            <IconButton onClick={() => setIsWithdrawRequestTableOpen(false)}>
              <Cross1Icon />
            </IconButton>
          </div>

          {withdrawRequests.length > 0 ? (
            <WithdrawRequestTable withdrawRequests={withdrawRequests} />
          ) : (
            <Typography
              variant="body2"
              className="text-mono-120 dark:text-mono-100"
            >
              You will be able to withdraw your tokens after the unstake
              schedule is completed. To unstake your tokens go to the unstake
              tab to schedule request.
            </Typography>
          )}
        </RestakeDetailCard.Root>
      </AnimatedTable>

      <Modal>
        <WithdrawModal
          delegatorInfo={delegatorInfo}
          isOpen={isWithdrawModalOpen}
          onClose={closeWithdrawModal}
          onItemSelected={(item) => {
            closeWithdrawModal();

            const { formattedAmount, assetId } = item;
            const commonOpts = {
              shouldDirty: true,
              shouldValidate: true,
            };

            setFormValue('assetId', assetId, commonOpts);
            setFormValue('amount', formattedAmount, commonOpts);
          }}
        />

        <SupportedChainModal
          isOpen={isChainModalOpen}
          onClose={closeChainModal}
          onChainChange={async (chainConfig) => {
            const typedChainId = calculateTypedChainId(
              chainConfig.chainType,
              chainConfig.id,
            );
            await switchChain(typedChainId);
            closeChainModal();
          }}
        />
      </Modal>
    </div>
  );
};

export default Page;
