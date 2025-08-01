import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu, Phone, Mail, Home, Search, Calculator, Users, TrendingUp, FileText,
  HelpCircle, Bookmark, User, LogOut, LogIn, MapPin
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink,
  NavigationMenuList, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// ----- CONFIGURE AGENT INFO -----
const AGENT_TAGLINE = "Your Trusted GTA Realtor";
const AGENT_AVATAR_URL = "/client-site/public/images/agents/IMG_9799.JPG"; // Place your agent photo here!

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ----- MAIN NAVIGATION -----
  const navigationItems = [
    {
      title: "Home",
      items: [
        { title: "Home", href: "/", description: "Homepage", icon: Home },
      ],
    },
    {
      title: "Listings",
      items: [
        { title: "Search Properties", href: "/search", description: "Find your dream home", icon: Search },
        { title: "Featured Listings", href: "/#listings", description: "Handpicked properties", icon: TrendingUp },
        { title: "Saved Properties", href: "/favorites", description: "Your favorites", icon: Bookmark, requiresAuth: true },
      ],
    },
    {
      title: "Buyers",
      items: [
        { title: "Buyers Guide", href: "/buyers", description: "Complete buying guide", icon: Users },
        { title: "Financing Options", href: "/buyers/financing-options", description: "Mortgage & financing info", icon: Calculator },
        { title: "First-Time Buyers", href: "/buyers/first-time-guide", description: "For first-time buyers", icon: Home },
        { title: "Buying Process", href: "/buyers/home-buying-process", description: "How to buy a home", icon: FileText },
      ],
    },
    {
      title: "Sellers",
      items: [
        { title: "Sellers Guide", href: "/sellers", description: "Complete selling guide", icon: TrendingUp },
        { title: "Home Valuation", href: "/sellers/valuation", description: "Get your home's value", icon: Calculator },
        { title: "Marketing Strategy", href: "/sellers/marketing-strategy", description: "How we market your home", icon: Users },
        { title: "Staging Tips", href: "/sellers/staging-tips", description: "Prepare for sale", icon: Home },
      ],
    },
    {
      title: "Map Search",
      items: [
        { title: "Map Search", href: "/map-search", description: "Search by map", icon: MapPin },
      ],
    },
    {
      title: "Useful Tools",
      items: [
        { title: "Calculators", href: "/calculators", description: "Financial tools", icon: Calculator },
        { title: "Blog & Articles", href: "/blog", description: "Market insights", icon: FileText },
        { title: "FAQ", href: "/faq", description: "Frequently asked questions", icon: HelpCircle },
        { title: "Tools", href: "/tools", description: "All property tools" },
      ],
    },
  ];

  const isActivePath = (path: string) => {
    if (path === "/#listings") return false;
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleNavigation = (href: string) => {
    if (href.startsWith("/#")) {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      navigate(href);
    }
    setIsMobileMenuOpen(false);
  };

  const ListItem = ({ className, title, children, href, icon: Icon, ...props }: any) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <button
            onClick={() => handleNavigation(href)}
            className={cn(
              "group block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-colors hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900 w-full text-left",
              className
            )}
            {...props}
          >
            <div className="flex items-center space-x-3">
              {Icon && <Icon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />}
              <div>
                <div className="text-sm font-semibold leading-none text-slate-900">{title}</div>
                <p className="line-clamp-2 text-sm leading-snug text-slate-600 mt-1">
                  {children}
                </p>
              </div>
            </div>
          </button>
        </NavigationMenuLink>
      </li>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Contact Bar */}
      <div className="bg-slate-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>(416) 555-0123</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>jigar@jigarpatelrealestate.com</span>
            </div>
          </div>
          <div className="text-yellow-400 font-semibold">
            Free Consultation Available
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Agent Avatar + Branding */}
          <Link to="/" className="flex items-center space-x-4 group">
            {/* Agent Photo */}
            <img
              src={AGENT_AVATAR_URL}
              alt="Agent"
              className="w-14 h-14 rounded-full object-cover border-2 border-blue-600 shadow-md"
            />
            {/* Brand, tagline */}
            <div>
              <div className="text-2xl font-bold text-slate-900 leading-tight">Jigar Patel</div>
              <div className="text-blue-600 font-semibold text-base leading-snug">Real Estate</div>
              <div className="text-slate-500 text-sm">{AGENT_TAGLINE}</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                {navigationItems.map((section) => (
                  <NavigationMenuItem key={section.title}>
                    <NavigationMenuTrigger
                      className={cn(
                        "h-12 px-6 text-base font-medium bg-transparent hover:bg-slate-50 data-[state=open]:bg-slate-50 transition-all duration-200",
                        section.items.some(item => isActivePath(item.href)) && "text-blue-600 bg-blue-50"
                      )}
                    >
                      {section.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-2 p-6 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
                        {section.items.map((item) => (
                          (!item.requiresAuth || user) && (
                            <ListItem
                              key={item.title}
                              title={item.title}
                              href={item.href}
                              icon={item.icon}
                            >
                              {item.description}
                            </ListItem>
                          )
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
                {/* Contact as prominent button */}
                <NavigationMenuItem>
                  <Button
                    onClick={() => navigate('/contact')}
                    className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Contact
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Menu & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* User menu for desktop */}
            {user ? (
              <div className="hidden lg:flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/favorites')}
                  className="flex items-center space-x-2"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Saved</span>
                </Button>
                {isAdmin && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin')}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-4">
                <Button
                  onClick={() => navigate('/auth')}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 h-12"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src={AGENT_AVATAR_URL}
                        alt="Agent"
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Jigar Patel</div>
                        <div className="text-sm text-blue-600">Real Estate</div>
                        <div className="text-slate-500 text-xs">{AGENT_TAGLINE}</div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <nav className="space-y-6">
                      {navigationItems.map((section) => (
                        <div key={section.title}>
                          <h3 className="font-semibold text-slate-900 mb-3 text-lg">{section.title}</h3>
                          <div className="space-y-2 ml-4">
                            {section.items.map((item) => (
                              (!item.requiresAuth || user) && (
                                <button
                                  key={item.title}
                                  onClick={() => handleNavigation(item.href)}
                                  className={cn(
                                    "flex items-center space-x-3 w-full p-3 rounded-lg text-left transition-colors",
                                    isActivePath(item.href)
                                      ? "bg-blue-50 text-blue-700"
                                      : "hover:bg-slate-50 text-slate-700"
                                  )}
                                >
                                  <item.icon className="h-5 w-5" />
                                  <div>
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-sm text-slate-500">{item.description}</div>
                                  </div>
                                </button>
                              )
                            ))}
                          </div>
                        </div>
                      ))}
                    </nav>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-slate-200 space-y-4">
                    {user ? (
                      <div className="space-y-2">
                        <Button
                          onClick={() => {
                            navigate('/favorites');
                            setIsMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Bookmark className="h-4 w-4 mr-2" />
                          Saved Properties
                        </Button>
                        {isAdmin && (
                          <Button
                            onClick={() => {
                              navigate('/admin');
                              setIsMobileMenuOpen(false);
                            }}
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <User className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Button>
                        )}
                        <Button
                          onClick={() => {
                            signOut();
                            setIsMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          onClick={() => {
                            navigate('/auth');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                      </div>
                    )}
                    <Button
                      onClick={() => {
                        navigate('/contact');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Contact Jigar
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
