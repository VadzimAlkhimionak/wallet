import React, { memo, useMemo } from "react"
import { View } from "react-native";
import { useHoldersAccounts, useHoldersHiddenAccounts, useNetwork, useSelectedAccount, useTheme } from "../../engine/hooks";
import { useHoldersHiddenPrepaidCards } from "../../engine/hooks/holders/useHoldersHiddenPrepaidCards";
import { HoldersAccounts } from "./HoldersAccounts";
import { HoldersCards } from "./HoldersCards";
import { HoldersAccountStatus } from "../../engine/hooks/holders/useHoldersAccountStatus";

export const HoldersProductComponent = memo(({ holdersAccStatus }: { holdersAccStatus?: HoldersAccountStatus }) => {
    const network = useNetwork();
    const theme = useTheme();
    const selected = useSelectedAccount();
    const accounts = useHoldersAccounts(selected!.address).data?.accounts;
    const prePaid = useHoldersAccounts(selected!.address).data?.prepaidCards;

    const [hiddenAccounts, markAccount] = useHoldersHiddenAccounts(selected!.address);
    const [hiddenPrepaidCards, markPrepaidCard] = useHoldersHiddenPrepaidCards(selected!.address);

    const visibleAccountsList = useMemo(() => {
        return (accounts ?? []).filter((item) => {
            return !hiddenAccounts.includes(item.id);
        });
    }, [hiddenAccounts, accounts]);

    const visiblePrepaidList = useMemo(() => {
        return (prePaid ?? []).filter((item) => {
            return !hiddenPrepaidCards.includes(item.id);
        });
    }, [hiddenPrepaidCards, prePaid]);

    const hasAccounts = visibleAccountsList?.length > 0;
    const hasPrepaid = visiblePrepaidList?.length > 0;

    if (!hasAccounts && !hasPrepaid) {
        return null;
    }

    return (
        <View style={{ marginTop: (hasAccounts || hasPrepaid) ? 16 : 0 }}>
            <HoldersAccounts
                owner={selected!.address}
                theme={theme}
                isTestnet={network.isTestnet}
                markAccount={markAccount}
                accs={visibleAccountsList}
                holdersAccStatus={holdersAccStatus}
            />
            <View style={{ marginTop: (hasAccounts && hasPrepaid) ? 16 : 0 }}>
                <HoldersCards
                    theme={theme}
                    isTestnet={network.isTestnet}
                    markPrepaidCard={markPrepaidCard}
                    cards={visiblePrepaidList}
                    holdersAccStatus={holdersAccStatus}
                />
            </View>
        </View>
    );
});

HoldersProductComponent.displayName = 'HoldersProductComponent';