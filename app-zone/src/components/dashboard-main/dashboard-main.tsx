"use client";
import { useState } from "react";
import { useWindowWidth } from "~/hooks/useWindowWidth";
import { FinancialSummary } from "~/components/financial-summary/financial-summary";
import { SideMenu } from "~/components/side-menu/side-menu";
import { Statement } from "~/components/statement/statement";
import { TransactionModal } from "~/components/transaction-modal/transaction-modal";
import { useUserStore } from "~/stores/useUserStore";

export const DashboardMain = () => {
  const windowWidth = useWindowWidth();
  const username = useUserStore((state) => state.username);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Side Menu - Hidden on mobile */}
        {windowWidth > 768 && (
          <aside className="lg:col-span-3">
            <SideMenu />
          </aside>
        )}

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-8">
          <FinancialSummary
            username={username}
            date={Date.now()}
            onNewTransactionButtonClick={openModal}
          />
          <Statement />
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal open={isModalOpen} onClose={closeModal} />
    </div>
  );
};
