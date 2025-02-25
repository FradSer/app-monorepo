import React, { FC, useCallback } from 'react';

import { useNavigation } from '@react-navigation/core';
import { useIntl } from 'react-intl';
import { Platform } from 'react-native';

import {
  Box,
  Center,
  ICON_NAMES,
  Icon,
  Select,
  useIsVerticalLayout,
} from '@onekeyhq/components';
import {
  HistoryRequestModalRoutesParams,
  HistoryRequestRoutes,
  SubmitRequestModalRoutesParams,
  SubmitRequestRoutes,
} from '@onekeyhq/kit/src/routes';
import {
  HomeRoutes,
  HomeRoutesParams,
  ModalRoutes,
  ModalScreenProps,
  RootRoutes,
} from '@onekeyhq/kit/src/routes/types';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import { useHelpLink } from '../../hooks/useHelpLink';
import extUtils from '../../utils/extUtils';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProps = ModalScreenProps<SubmitRequestModalRoutesParams> &
  ModalScreenProps<HistoryRequestModalRoutesParams>;

type StackNavigationProps = NativeStackNavigationProp<
  HomeRoutesParams,
  HomeRoutes.SettingsScreen
>;

type Option = {
  label: string;
  value: string;
  iconProps: {
    name: ICON_NAMES;
  };
};

type GroupOption = {
  title: string;
  options: Option[];
};

const HelpSelector: FC = () => {
  const intl = useIntl();
  const navigation = useNavigation<NavigationProps['navigation']>();
  const isSmallScreen = useIsVerticalLayout();
  const userGuideUrl = useHelpLink({ path: 'categories/360000170236' });
  const supportUrl = useHelpLink({ path: '' });
  const walletManual = useHelpLink({ path: 'articles/360002123856' });
  const stackNavigation = useNavigation<StackNavigationProps>();

  const openUrl = useCallback(
    (url: string, title?: string) => {
      console.log('url', url, 'title', title);
      if (['android', 'ios'].includes(Platform.OS)) {
        stackNavigation.navigate(HomeRoutes.SettingsWebviewScreen, {
          url,
          title,
        });
      } else {
        window.open(url, '_blank');
      }
    },
    [stackNavigation],
  );

  const options: GroupOption[] = [
    {
      title: '',
      options: [
        {
          label: intl.formatMessage({ id: 'form__submit_a_request' }),
          value: 'submit_request',
          iconProps: {
            name: isSmallScreen ? 'AnnotationOutline' : 'AnnotationSolid',
          },
        },
        {
          label: intl.formatMessage({ id: 'form__s_request_history' }),
          value: 'history',
          iconProps: {
            name: isSmallScreen ? 'ClockOutline' : 'ClockSolid',
          },
        },
      ],
    },
    {
      title: '',
      options: [
        {
          label: intl.formatMessage({ id: 'form__help_support' }),
          value: 'support',
          iconProps: {
            name: isSmallScreen ? 'SupportOutline' : 'SupportSolid',
          },
        },
        {
          label: intl.formatMessage({ id: 'form__beginner_guide' }),
          value: 'guide',
          iconProps: {
            name: isSmallScreen ? 'MapOutline' : 'MapSolid',
          },
        },
        {
          label: intl.formatMessage({ id: 'form__hardware_wallet_manuals' }),
          value: 'hardware_wallet',
          iconProps: {
            name: isSmallScreen ? 'BookmarkAltOutline' : 'BookmarkAltSolid',
          },
        },
      ],
    },
    {
      title: '',
      options: [
        {
          label: intl.formatMessage({ id: 'title__official_website' }),
          value: 'website',
          iconProps: {
            name: isSmallScreen ? 'GlobeAltOutline' : 'GlobeAltSolid',
          },
        },
        {
          label: intl.formatMessage({ id: 'title__buy_onekey_hardware' }),
          value: 'shop',
          iconProps: {
            name: isSmallScreen ? 'ShoppingBagOutline' : 'ShoppingBagSolid',
          },
        },
        {
          label: intl.formatMessage({ id: 'title__client_download' }),
          value: 'download',
          iconProps: {
            name: isSmallScreen ? 'DownloadOutline' : 'DownloadSolid',
          },
        },
      ],
    },
  ];

  const onChange = (value: string) => {
    setTimeout(() => {
      switch (value) {
        case 'submit_request':
          if (platformEnv.isExtensionUiPopup) {
            extUtils.openExpandTab({
              routes: [RootRoutes.Modal, ModalRoutes.SubmitRequest],
              params: {
                screen: SubmitRequestRoutes.SubmitRequestModal,
              },
            });
            setTimeout(() => {
              window.close();
            }, 300);
          } else {
            navigation.navigate(RootRoutes.Modal, {
              screen: ModalRoutes.SubmitRequest,
              params: {
                screen: SubmitRequestRoutes.SubmitRequestModal,
              },
            });
          }
          break;
        case 'guide':
          openUrl(
            userGuideUrl,
            intl.formatMessage({ id: 'form__beginner_guide' }),
          );
          break;
        case 'support':
          openUrl(supportUrl, intl.formatMessage({ id: 'form__help_support' }));
          break;
        case 'hardware_wallet':
          openUrl(
            walletManual,
            intl.formatMessage({ id: 'form__hardware_wallet_manuals' }),
          );
          break;
        case 'history':
          navigation.navigate(RootRoutes.Modal, {
            screen: ModalRoutes.HistoryRequest,
            params: {
              screen: HistoryRequestRoutes.HistoryRequestModal,
            },
          });
          break;
        case 'website':
          openUrl(
            'https://help.onekey.so/hc/',
            intl.formatMessage({ id: 'title__official_website' }),
          );
          break;
        case 'shop':
          openUrl(
            'https://shop.onekey.so/',
            intl.formatMessage({ id: 'title__buy_onekey_hardware' }),
          );
          break;
        case 'download':
          openUrl(
            'https://onekey.so/download',
            intl.formatMessage({ id: 'title__client_download' }),
          );
          break;
        default:
          break;
      }
    }, 200);
  };

  return (
    <Box>
      <Select
        title={
          isSmallScreen ? intl.formatMessage({ id: 'title__help' }) : undefined
        }
        dropdownPosition="top-right"
        dropdownProps={isSmallScreen ? {} : { minW: '240px', height: '320px' }}
        positionTranslateY={-4}
        headerShown={false}
        options={options}
        isTriggerPlain
        footer={null}
        activatable={false}
        onChange={onChange}
        renderTrigger={() => (
          <Center
            width="50px"
            height="50px"
            bg="action-secondary-default"
            borderRadius="25px"
            borderWidth="1px"
            borderColor="border-default"
          >
            <Icon size={24} name="QuestionMarkCircleSolid" />
          </Center>
        )}
      />
    </Box>
  );
};

export default HelpSelector;
