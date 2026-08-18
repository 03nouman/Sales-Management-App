import type { ReactNode } from "react";
import { Bell, Menu } from "lucide-react";

type MainContentProps = {
  children: ReactNode;
  user: {
    name?: string;
  } | null;
  onOpenNavigation: () => void;
  onLogout: () => void;
};

export default function MainContent({
  children,
  user,
  onOpenNavigation,
  onLogout,
}: MainContentProps) {
  return (
    <main
      className="
        min-h-screen
        pb-[72px]
        lg:ml-[230px]
        lg:pb-0
      "
    >
      <header
        className="
          sticky top-0 z-30
          flex min-h-[58px]
          items-center
          border-b border-[#e5e2ed]
          bg-[#faf9fd]/95
          px-3
          backdrop-blur
          sm:px-5
          lg:min-h-[68px]
          lg:justify-between
          lg:px-7
        "
      >
        {/* Mobile / Tablet */}
        <div
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-2
            lg:hidden
          "
        >
          <button
            type="button"
            onClick={onOpenNavigation}
            aria-label="Open navigation"
            className="
              grid h-9 w-9
              shrink-0
              place-items-center
              rounded-lg
              text-slate-700
              transition
              hover:bg-slate-100
            "
          >
            <Menu size={21} />
          </button>

          <h1
            className="
              truncate
              text-[21px]
              font-extrabold
              tracking-tight
              text-[#263c93]
            "
          >
            HardwarePro
          </h1>
        </div>

        {/* Desktop */}
        <h1
          className="
            hidden
            text-xl
            font-medium
            text-[#263c93]
            lg:block
          "
        >
          Hardware Shop
        </h1>

        {/* Header Actions */}
        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-4
          "
        >
          <button
            type="button"
            aria-label="Notifications"
            className="
              relative
              grid h-9 w-9
              place-items-center
              rounded-lg
              text-slate-600
              transition
              hover:bg-slate-100
              lg:h-auto
              lg:w-auto
            "
          >
            <Bell size={20} strokeWidth={1.8} />

            <span
              className="
                absolute
                right-1.5 top-1.5
                h-2 w-2
                rounded-full
                border border-white
                bg-red-500
                lg:-right-1
                lg:-top-1
              "
            />
          </button>

          <button
            type="button"
            onClick={onLogout}
            title={`Logout ${user?.name ?? "User"}`}
            className="
              hidden
              h-9 w-9
              place-items-center
              rounded-full
              border border-[#ccd4e8]
              bg-[#e7ecf8]
              text-sm
              font-bold
              text-[#263c93]
              transition
              hover:ring-2
              hover:ring-[#d8dcfa]
              lg:grid
            "
          >
            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </button>
        </div>
      </header>

      {/* Page content */}
      <div
        className="
          mx-auto
          w-full
          max-w-[1800px]
          p-3
          sm:p-5
          md:p-6
          xl:p-8
        "
      >
        {children}
      </div>
    </main>
  );
}
