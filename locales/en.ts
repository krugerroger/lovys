// locales/en.ts
export default {
  HomePage: {
    hero: {
      title: "Find the best escorts in ",
      subtitle: "Trusted platform with over 1,765,491 verified reviews"
    },
    search: {
      title: "Search for an escort",
      city: {
        label: "City",
        placeholder: "Select a city",
        filterPlaceholder: "Filter cities...",
        noResults: "No city found for \"{search}\"",
        recent: "RECENT",
        seeAllCities: "See all cities →",
        popularBadge: "Popular city",
        availableBadge: "Available"
      },
      language: {
        label: "🌍 Language",
        placeholder: "Choose language"
      },
      searchButton: {
        withCity: "SEARCH IN {city}",
        withoutCity: "SELECT A CITY"
      },
      trustBadges: {
        secure: "Secure verification",
        reviews: "Authentic reviews"
      }
    },
    categories: {
      title: "Popular categories",
      list: {
        vip: "VIP Escort",
        companion: "Companion",
        massage: "Massage",
        outcall: "Outcall",
        incall: "Incall",
        new: "New escorts",
        verified: "Verified profiles",
        independent: "Independent",
        agencies: "Agencies",
        duo: "Duo/Trio"
      }
    },
    popularCities: {
      title: "Popular cities",
      stats: {
        frenchCities: "Cities in France",
        popularCities: "Popular cities"
      },
      exploreAll: "Explore all cities"
    },
    recentSearches: {
      title: "Recent searches"
    },
    featuredEscorts: {
      title: "Featured escorts",
      viewAll: "View all",
      loading: "Loading...",
      empty: {
        title: "No escorts available",
        description: "Listings will be available soon"
      }
    },
    regions: {
      title: "Discover by region",
      citiesCount: "cities",
      seeCity: "See {city} →",
      list: {
        ileDeFrance: "Île-de-France",
        paca: "Provence-Alpes-Côte d'Azur",
        auvergneRhoneAlpes: "Auvergne-Rhône-Alpes",
        occitanie: "Occitanie",
        nouvelleAquitaine: "Nouvelle-Aquitaine",
        hautsDeFrance: "Hauts-de-France"
      }
    },
    stats: {
      verifiedReviews: "Verified reviews",
      citiesCovered: "Cities covered",
      customerSupport: "Customer support",
      verifiedAds: "Verified ads"
    },
    footer: {
      terms: "By using this site, you agree to our",
      copyright: "© 2025 Lovira - All rights reserved. Service reserved for adults (+18 years).",
      termsLink: "terms of use",
      privacyLink: "privacy policy"
    },
    ClientProfile: {
      Chat: {
        title: "Messages",
        conversations: {
          searchPlaceholder: "Search a conversation...",
          noConversations: "No conversations",
          noConversationsDescription: "Start a new conversation to chat",
          newConversation: "New conversation",
          youPrefix: "You: ",
          unreadCount: "{count, plural, one {# unread message} other {# unread messages}}",
          today: "Today",
          yesterday: "Yesterday",
          unknownDate: "Unknown date",
          online: "Online",
          offline: "Offline",
          viewConversations: "View conversations"
        },
        chat: {
          noConversationSelected: "No conversation selected",
          noConversationSelectedDescription: "Select a conversation to start chatting",
          noMessages: "No messages",
          firstMessagePrompt: "Send your first message!",
          openingConversation: "Opening conversation...",
          pleaseWait: "Please wait",
          typingPlaceholder: "Type your message...",
          sendButton: "Send",
          sending: "Sending..."
        },
        userTypes: {
          escort: "Escort",
          client: "Client",
          admin: "Administrator"
        },
        errors: {
          notAuthenticated: "You must be logged in to access messages",
          clientsOnly: "Only clients can contact escorts",
          escortNotFound: "Escort not found",
          conversationExists: "Conversation already exists",
          sendMessageError: "Error sending message",
          loadError: "Loading error",
          markReadError: "Error marking as read"
        },
        loading: {
          conversations: "Loading conversations...",
          messages: "Loading messages..."
        }
      }
    }
  },
  Auth: {
    SignIn: {
      title: "Welcome",
      subtitle: "Sign in to access your account",
      form: {
        email: {
          label: "Email address",
          placeholder: "your.email@example.com",
          errors: {
            required: "Email is required",
            invalid: "Please enter a valid email address"
          }
        },
        password: {
          label: "Password",
          placeholder: "Enter your password",
          errors: {
            required: "Password is required"
          },
          show: "Show password",
          hide: "Hide password"
        },
        forgotPassword: "Forgot password?",
        submit: {
          text: "Sign in",
          loading: "Signing in..."
        }
      },
      register: {
        noAccount: "Don't have an account?",
        orRegisterAs: "Or register as:",
        user: "User",
        escort: "Escort"
      },
      features: {
        title: "Features:",
        secureAuth: "Secure authentication",
        personalizedDashboard: "Personalized dashboard",
        easyAccountManagement: "Easy account management"
      },
      messages: {
        success: "Login successful! Welcome!",
        error: "Login failed: {error}",
        genericError: "An error occurred during login. Please try again."
      }
    },
    EscortRegistration: {
      title: "Create an escort account",
      subtitle: "Join our professional platform",
      fields: {
        username: "Username",
        email: "Email address",
        password: "Password",
        confirmPassword: "Confirm password",
        required: "Required"
      },
      placeholders: {
        username: "Choose a username",
        email: "your.email@example.com",
        password: "Create a secure password",
        confirmPassword: "Re-enter your password"
      },
      buttons: {
        createAccount: "Create escort account",
        creatingAccount: "Creating account...",
        showPassword: "Show password",
        hidePassword: "Hide password",
        signIn: "Sign in here",
        switchToLogin: "Sign in to your account"
      },
      messages: {
        loginPrompt: "Already have an account?",
        agreeTerms: "By signing up, you agree to our Terms of Use and Privacy Policy",
        success: "Escort account created successfully! 🎉",
        successDescription: "Welcome to our platform!",
        emailVerificationSent: "Account created successfully! 🎉",
        emailVerificationDescription: "Please check your email to confirm your account.",
        registrationFailed: "Registration failed",
        genericError: "An error occurred during registration. Please try again."
      },
      errors: {
        usernameRequired: "Username is required",
        usernameTooShort: "Username must be at least 3 characters",
        emailRequired: "Email is required",
        emailInvalid: "Please enter a valid email address",
        passwordRequired: "Password is required",
        passwordTooShort: "Password must be at least 6 characters",
        confirmPasswordRequired: "Please confirm your password",
        passwordsMismatch: "Passwords do not match"
      },
      benefits: {
        title: "Benefits for escorts",
        quickSetup: {
          title: "Quick setup",
          description: "Get started in minutes with our simple registration process."
        },
        unlimitedAds: {
          title: "Unlimited ads",
          description: "Post as many ads as needed for your services."
        },
        largeClientBase: {
          title: "Large client base",
          description: "Access thousands of verified clients looking for services."
        }
      }
    },
  },
  EscortRegistration: {
    pageTitle: "Create an Escort Account",
    pageSubtitle: "Join our professional platform",
    
    form: {
      username: {
        label: "Username",
        placeholder: "Choose a username",
        required: "Username is required",
        minLength: "Username must be at least 3 characters"
      },
      email: {
        label: "Email address",
        placeholder: "your.email@example.com",
        required: "Email is required",
        invalid: "Please enter a valid email address"
      },
      password: {
        label: "Password",
        placeholder: "Create a secure password",
        required: "Password is required",
        minLength: "Password must be at least 6 characters"
      },
      confirmPassword: {
        label: "Confirm password",
        placeholder: "Re-enter your password",
        required: "Please confirm your password",
        noMatch: "Passwords do not match"
      },
      requiredField: "*"
    },
    
    buttons: {
      submit: "Create Escort Account",
      submitting: "Creating account...",
      signIn: "Sign in here"
    },
    
    messages: {
      accountCreated: "Account created successfully! 🎉",
      verifyEmail: "Please check your email to activate your account.",
      welcome: "Welcome to our platform!",
      registrationFailed: "Registration failed",
      errorOccurred: "An error occurred during registration. Please try again.",
      alreadyHaveAccount: "Already have an account?"
    },
    
    benefits: {
      title: "Benefits for Escorts",
      quickSetup: {
        title: "Quick setup",
        description: "Get started in minutes with our simple registration process."
      },
      unlimitedAds: {
        title: "Unlimited ads",
        description: "Post as many ads as you want for your services."
      },
      largeClientBase: {
        title: "Large client base",
        description: "Access thousands of verified clients looking for services."
      }
    }
  },
  ClientRegistration: {
    form: {
      username: {
        label: "Your name or nickname",
        placeholder: "Choose a username",
        required: "Username is required",
        minLength: "Username must be at least 3 characters"
      },
      email: {
        label: "Email address",
        placeholder: "your.email@example.com",
        required: "Email is required",
        invalid: "Please enter a valid email address"
      },
      password: {
        label: "Password",
        placeholder: "Create a secure password",
        required: "Password is required",
        minLength: "Password must be at least 6 characters"
      },
      confirmPassword: {
        label: "Confirm password",
        placeholder: "Re-enter your password",
        required: "Please confirm your password",
        noMatch: "Passwords do not match"
      },
      requiredField: "*"
    },
    
    buttons: {
      submit: "Create my account",
      submitting: "Creating account...",
      signIn: "Sign in here"
    },
    
    messages: {
      accountCreated: "Account created successfully! 🎉",
      userAccountCreated: "Client account created successfully! 🎉",
      verifyEmail: "Please check your email to activate your account.",
      welcome: "Welcome to our platform!",
      registrationFailed: "Registration failed",
      errorOccurred: "An error occurred during registration. Please try again.",
      alreadyHaveAccount: "Already have an account?"
    },
    
    benefits: {
      title: "Benefits for Clients",
      freeChat: {
        title: "Free private chat",
        description: "Communicate directly with service providers in a secure environment."
      },
      verifiedProfiles: {
        title: "Verified profiles",
        description: "Browse verified and trusted service providers."
      },
      securePlatform: {
        title: "Secure platform",
        description: "Your privacy and security are our top priority."
      }
    }
  },
  Profile: {
    Favorites: {
      // Header
      title: "My Favorites",
      subtitle: "{{count}} escort in your favorites",
      subtitle_plural: "{{count}} escorts in your favorites",
      
      // Main actions
      actions: {
        refresh: "Refresh",
        refreshing: "Refreshing...",
        allCities: "All cities",
        removeAll: "Remove all favorites",
        removeAllConfirm: "Are you sure you want to remove all your favorites?",
        backToAds: "← Back to ads",
        removeFromFavorites: "Remove from favorites"
      },
      
      // Statistics
      stats: {
        totalFavorites: "Total favorites",
        cities: "Cities",
        maxPhotos: "Max photos",
        lastAdded: "Last added",
        noDate: "None"
      },
      
      // Empty states
      empty: {
        noFavorites: "No favorites",
        noFavoritesDescription: "Add escorts to your favorites by clicking the heart icon in the ads",
        noFavoritesInCity: "No favorites in this city",
        noFavoritesInCityDescription: "No favorites found for the selected city",
        browseAds: "Browse ads"
      },
      
      // Filters
      filters: {
        filterLabel: "Filter:",
        adCount: "{{count}} ad",
        adCount_plural: "{{count}} ads",
        clearFilter: "Clear filter"
      },
      
      // Ad card
      card: {
        unknownCity: "Unknown",
        noName: "Nameless Escort",
        noDescription: "No description available",
        photosCount: "{{count}} photo",
        photosCount_plural: "{{count}} photos",
        rateNotSpecified: "Rate not specified",
        ratePerHour: "€{{rate}}/h",
        viewAd: "View ad",
        viewCity: "View city",
        addedOn: "Added on",
        addedAt: "at"
      },
      
      // Organization tips
      tips: {
        title: "Organization tips",
        sortTitle: "Sort your favorites",
        sortByCity: "By city to find quickly",
        sortByDate: "By date added (newest first)",
        sortByRate: "By rate to match your budget",
        quickActionsTitle: "Quick actions",
        removeAction: "Click the heart icon to remove a favorite",
        filterAction: "Use the city filter to organize better",
        noteAction: "Note ads to find them easier"
      },
      
      // Loading and errors
      loading: {
        redirecting: "Redirecting to login page...",
        loadingFavorites: "Loading your favorites..."
      }
    },
    Settings: {
        title: "Profile settings",
        subtitle: "Manage your personal information",
        email: "Email",
        emailHelper: "A confirmation email will be sent if you change your address",
        username: "Username",
        changePassword: "Change password",
        newPassword: "New password",
        newPasswordPlaceholder: "Minimum 6 characters",
        currentPassword: "Current password",
        currentPasswordPlaceholder: "Required to change password",
        save: "Save",
        saving: "Saving...",
        contactAdmin: "Contact administrator",
        deleteAccount: "Delete account?",
        deleteAccountMessage: "Please send a message to {email} to request account deletion",
        goHome: "Home",
        backToHome: "Back to home",
        saveChanges: "Save changes",
        messages: {
          loginRequired: "You must be logged in",
          usernameRequired: "Username is required",
          currentPasswordRequired: "You must provide your current password to set a new one",
          passwordLength: "New password must be at least 6 characters",
          currentPasswordIncorrect: "Current password is incorrect",
          updateSuccess: "Profile updated successfully",
          updateError: "Error updating profile",
          emailConfirmationSent: "A confirmation email has been sent to your new address"
        }
    },
      Chat: {
      title: "Messages",
      
      errors: {
        notAuthenticated: "You must be logged in to access this page",
        clientsOnly: "Only clients can initiate conversations",
        escortNotFound: "Escort not found",
        conversationExists: "A conversation already exists",
        loadError: "Loading error",
        sendMessageError: "Error sending message",
        markReadError: "Error marking as read"
      },
      
      conversations: {
        today: "Today",
        yesterday: "Yesterday",
        unknownDate: "Unknown date",
        viewConversations: "View conversations",
        searchPlaceholder: "Search a conversation...",
        noConversations: "No conversations",
        noConversationsDescription: "Start a new conversation with a provider",
        newConversation: "New conversation",
        youPrefix: "You: ",
        unreadCount: "{{count}} new",
        unreadCount_plural: "{{count}} new",
        online: "Online",
        offline: "Offline"
      },
      
      loading: {
        conversations: "Loading conversations...",
        messages: "Loading messages..."
      },
      
      chat: {
        openingConversation: "Opening conversation...",
        pleaseWait: "Please wait",
        noConversationSelected: "Select a conversation",
        noConversationSelectedDescription: "Choose a conversation from the list to start chatting",
        noMessages: "No messages yet",
        firstMessagePrompt: "Send the first message to start the conversation",
        typingPlaceholder: "Type your message...",
        sending: "Sending...",
        sendButton: "Send message"
      },
      
      userTypes: {
        client: "Client",
        escort: "Escort",
        admin: "Admin"
      }
    }
  },
  Escorts: {
    CityPage: {
      // Header
      title: "Escorts in {{city}}",
      subtitle: "{{count}} verified ad • Ranked by relevance",
      subtitle_plural: "{{count}} verified ads • Ranked by relevance",
      searching: "Searching for ads...",
      
      // Statistics
      stats: {
        totalAds: "Total ads",
        top3: "TOP 3",
        top10: "TOP 10",
        boosted: "Boosted"
      },
      
      // Ranking legend
      legend: {
        title: "Ranking legend:",
        top1: "TOP 1",
        top2: "TOP 2",
        top3: "TOP 3",
        top10: "TOP 10",
        others: "Other positions"
      },
      
      // Empty state
      empty: {
        title: "No ads found",
        description: "No escorts are registered yet in {city}. Be the first to create an ad!"
      },
      
      // Card information
      card: {
        position: "Position {{rank}}/{{total}}",
        boosted: "⬆ Boosted",
        addedOn: "Added on"
      },
      
      // About section
      about: {
        title: "About ranking",
        howRanked: {
          title: "How are ads ranked?",
          recentlyBoosted: "Recently boosted ads appear at the top",
          recentAds: "Recent ads are favored",
          boostDecay: "Boost weakens after 24 hours"
        },
        tips: {
          title: "Tips to improve your position",
          useBoost: "Use the Boost feature to appear in TOP 1",
          updateRegularly: "Update your ad regularly",
          addPhotos: "Add quality photos"
        }
      },
      
      // Pagination
      pagination: {
        previous: "← Previous",
        next: "Next →"
      },
      
      // Nearby cities
      nearby: {
        title: "Explore other cities",
        viewAll: "View all cities →"
      }
    },
    ProfilePage: {
      // Header
      verified: "Verified",
      online: "Online",
      offline: "Offline",
      
      // Not found state
      notFound: {
        title: "Ad not found",
        description: "This ad does not exist or is no longer available",
        backButton: "← Back to {{city}} ads"
      },
      
      // Main sections
      about: {
        title: "About",
        noDescription: "No description provided.",
        characteristics: "Characteristics",
        servicesOffered: "Services offered"
      },
      
      // Physical details
      physicalDetails: {
        age: "Age",
        ageUnit: "years",
        height: "Height",
        heightUnit: "cm",
        weight: "Weight",
        weightUnit: "kg",
        bust: "Bust"
      },
      
      // Services
      services: {
        analSex: "Anal sex",
        oralWithoutCondom: "Oral without condom",
        kissing: "Kissing",
        cunnilingus: "Cunnilingus",
        cumInMouth: "Cum in mouth (CIM)",
        cumInFace: "Cum in face (CIF)",
        cumOnBody: "Cum on body (COB)",
        eroticMassage: "Erotic massage",
        striptease: "Striptease",
        goldenShower: "Golden shower"
      },
      
      // Contacts
      contacts: {
        title: "Contacts",
        phone: "Phone",
        email: "Email",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        instagram: "Instagram"
      },
      
      // Gallery
      gallery: {
        title: "Photo gallery"
      },
      
      // Video
      video: {
        title: "Escort video",
        notSupported: "Your browser does not support video playback.",
        label: "Video"
      },
      
      // Similar ads
      similar: {
        title: "Other escorts in {{city}}",
        startingFrom: "Starting from"
      },
      
      // Sidebar contact
      contact: {
        title: "Contact",
        sendMessage: "Send a message"
      },
      
      // Rates
      rates: {
        title: "Rates",
        thirtyMinutes: "30 minutes",
        oneHour: "1 hour",
        twoHours: "2 hours",
        fullNight: "Full night"
      },
      
      // Practical information
      info: {
        title: "Information",
        status: "Status",
        lastUpdate: "Last update",
        backToAds: "← Back to ads"
      }
    },
    CategoryPage: {
    // Breadcrumb
    breadcrumb: {
      categories: "Categories"
    },
    
    // Header
    header: {
      title: "{{category}} Escorts",
      profiles: "Profiles",
      cities: "Cities",
      topCities: "Top cities"
    },
    
    // Filters
    filters: {
      filterByCity: "Filter by city:",
      moreOthers: "+{{count}} others",
      sortBy: {
        newest: "Newest",
        priceAsc: "Price ascending",
        priceDesc: "Price descending",
        popular: "Popular"
      }
    },
    
    // Empty state
    empty: {
      title: "No ads found",
      description: "No escorts currently match the \"{{category}}\" category. Check back soon or explore other categories.",
      viewAllCategories: "← View all categories",
      backHome: "Back to home"
    },
    
    // Pagination
    pagination: {
      previous: "← Previous",
      next: "Next →"
    },
    
    // Similar categories
    similar: {
      title: "Similar categories",
      viewAll: "View all →"
    },
    
    // About section
    about: {
      title: "About {{category}} escorts",
      description1: "The \"{{category}}\" category groups escorts that specifically match this criterion. Each profile has been manually verified to ensure correspondence with the category.",
      description2: "To find exactly what you're looking for, use the available city and sort filters. You can also combine this category with other search criteria.",
      verifiedProfiles: "Verified profiles",
      activeAds: "{{count}} active ad",
      activeAds_plural: "{{count}} active ads",
      citiesAvailable: "{{count}} city available",
      citiesAvailable_plural: "{{count}} cities available"
    },
    
    // Tips
    tips: {
      searchTip: {
        title: "Search tip",
        description: "Combine this category with a specific city to refine your results."
      },
      verifiedProfiles: {
        title: "Verified profiles",
        description: "All ads are verified to ensure profile authenticity."
      },
      updates: {
        title: "Updates",
        description: "New ads are added daily in this category."
      }
    }
    }
  },
  Manage: {
    CityAdsPage: {
      loading: "Loading ads...",
      pageTitle: "My ads in",
      pageSubtitle: "Manage all your ads in this city",
      stats: {
        totalAds: "Total ads",
        approved: "Approved",
        pending: "Pending",
        averagePrice: "Average price",
        approvedRate: "Approval rate",
        lastUpdated: "Last updated"
      },
      actions: {
        newAdInCity: "New ad in",
        newAdOtherCity: "New ad in another city",
        createFirstAd: "Create a first ad",
        viewAllAds: "View all my ads",
        viewAllCities: "View all cities",
        createAnotherAd: "Create another ad"
      },
      filters: {
        searchPlaceholder: "Search your ads...",
        status: {
          all: "All statuses",
          active: "Active only",
          pending: "Pending only"
        },
        sort: {
          recent: "Most recent",
          price_asc: "Price: low to high",
          price_desc: "Price: high to low"
        }
      },
      emptyState: {
        title: "No ads in",
        subtitle: "Create your first ad in",
        description: "to start attracting clients in this area."
      },
      adCard: {
        untitled: "Untitled ad",
        noDescription: "No description provided.",
        perHour: "/ hour",
        thirtyMinutes: "30min:",
        photos: "photos",
        views: "views",
        viewDetails: "View details",
        menu: {
          editAd: "Edit ad",
          preview: "Preview",
          duplicate: "Duplicate",
          delete: "Delete"
        }
      },
      badges: {
        approved: "Approved",
        pending: "Pending",
        rejected: "Rejected",
        draft: "Draft"
      },
      performance: {
        title: "Performance Summary",
        description: "Efficiently manage your ads to maximize visibility and bookings in"
      },
      messages: {
        deleteConfirm: "Are you sure you want to delete this ad? This action is irreversible.",
        deleteSuccess: "Ad successfully deleted",
        deleteError: "Failed to delete ad",
        duplicateSuccess: "Ad successfully duplicated",
        duplicateError: "Failed to duplicate ad",
        notFound: "Ad not found"
      },
    },
    CityAdIDPage: {
        notFound: {
          title: "Ad not found",
          description: "The ad with the ID does not exist or you don't have access to it.",
          backToAds: "Back to my ads"
        },
        header: {
          title: "Management in",
          position: "Position",
          total: "out of"
        },
        rank: {
          title: "Current ranking",
          currentRank: "Ranking in",
          position: "Position",
          totalAds: "Total ads",
          status: "Status",
          excellent: "Excellent",
          good: "Good",
          toImprove: "Needs improvement",
          topOne: "🏆 TOP 1",
          topTwo: "🥈 TOP 2",
          topThree: "🥉 TOP 3",
          topNumber: "TOP"
        },
        loading: "Loading...",
        error: {
          title: "Loading error",
          message: "Unable to calculate position."
        },
        lastBoost: {
          title: "Last boost",
          active: "✓ Active",
          justNow: "just now",
          hoursAgo: "hours ago",
          hourAgo: "1 hour ago",
          daysAgo: "days ago"
        },
        actions: {
          title: "Actions",
          editProfile: "Edit profile",
          editDescription: "Edit your information"
        },
        boost: {
          title: "Boost in",
          subtitle: "Go to position #1 in this city",
          feature1: "Guaranteed #1 position",
          feature1Desc: "Immediately after boosting",
          feature2: "Recent boost priority",
          feature2Desc: "Most recent ones displayed first",
          button: "BOOST NOW",
          buttonRe: "RE-BOOST",
          buttonLoading: "Boosting...",
          currentPosition: "Current position:",
          noAdsFound: "No ads found in",
          beFirst: "Be the first to sign up!"
        },
        howItWorks: {
          title: "How is your rank calculated?",
          step1: "Boosted ads",
          step1Desc: "First, sorted by boost date (most recent first)",
          step2: "Non-boosted ads",
          step2Desc: "Then, sorted by creation date (most recent first)",
          step3: "Priority",
          step3Desc: "Recent boosts > Old boosts > Non-boosted recent",
          step4: "Instant boost",
          step4Desc: "A boost automatically places you in position #1"
        },
        messages: {
          boostError: "Unable to find ad ID",
          boostSuccess: "Successfully boosted in",
          boostConnectionError: "Connection error",
          boostGenericError: "An error occurred",
          dateInvalid: "Invalid date"
        }
    },
    Create: {
      title: "Create an ad",
      sections: {
        basicInfo: "Basic Information",
        location: "Location",
        physicalDetails: "Physical Details",
        rates: "Rates",
        services: "Services",
        contacts: "Contacts",
        description: "Description",
        categories: "Categories",
        media: "Media"
      },
      fields: {
        adTitle: "Ad title",
        required: "Required",
        country: "Country",
        city: "City",
        age: "Age",
        height: "Height (cm)",
        weight: "Weight (kg)",
        bust: "Bust",
        currency: "Currency",
        thirtyMinutes: "30 minute rate",
        oneHour: "1 hour rate",
        twoHours: "2 hour rate",
        fullNight: "Overnight rate",
        phoneNumber: "Phone number",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        instagram: "Instagram",
        twitter: "Twitter/X",
        description: "Description"
      },
      placeholders: {
        adTitle: "e.g. Beautiful Jasmine - Available in Paris",
        selectCity: "Select a city...",
        searchCity: "Search for a city...",
        selectAge: "Select an age",
        selectHeight: "Select your height",
        selectWeight: "Select your weight",
        selectBust: "Select",
        thirtyMinutes: "30min rate",
        oneHour: "1h rate",
        twoHours: "2h rate",
        fullNight: "Overnight rate",
        phoneNumber: "+33 6 12 34 56 78",
        whatsapp: "+33 6 12 34 56 78",
        telegram: "@username",
        instagram: "@username",
        twitter: "@username",
        description: "Describe your services..."
      },
      messages: {
        loginRequired: "You must be logged in",
        escortOnly: "Only escorts can create ads",
        cityRequired: "Please select at least one city",
        submitSuccess: "Ad submitted successfully!",
        submitError: "Failed to submit ad",
        citiesAvailable: "cities available",
        noCitiesFound: "No cities found",
        citySelected: "city selected",
        noCitySelected: "No city selected",
        uploadImages: "Upload images",
        imagesUploaded: "images uploaded",
        uploadVideo: "Upload a video",
        uploadButton: "Upload"
      },
      buttons: {
        publish: "Publish ad",
        publishing: "Submitting...",
        done: "Done",
        clear: "Clear",
        selectParis: "Paris",
        selectLyon: "Lyon",
        selectMarseille: "Marseille"
      },
      categories: {
        analSex: "Anal sex",
        asianGirls: "Asian girls",
        bbw: "BBW",
        bigTits: "Big tits",
        blonde: "Blonde",
        brunette: "Brunette",
        cim: "CIM",
        ebony: "Ebony",
        eroticMassage: "Erotic massage",
        europeanGirls: "European girls",
        kissing: "Kissing",
        latinaGirls: "Latina girls",
        mature: "Mature",
        vipGirls: "VIP girls"
      },
      services: {
        analSex: "Anal sex",
        oralWithoutCondom: "Oral without condom",
        kissing: "Kissing",
        cunnilingus: "Cunnilingus",
        cumInMouth: "Cum in mouth (CIM)",
        cumInFace: "Cum in face (CIF)",
        cumOnBody: "Cum on body (COB)",
        eroticMassage: "Erotic massage",
        striptease: "Striptease",
        goldenShower: "Golden shower"
      },
      contactSections: {
        phone: "Phone number",
        messengers: "Social media & Messaging apps"
      },
      options: {
        years: "years old",
        yes: "Yes",
        no: "No",
        select: "Select"
      },
      countries: {
        fr: "France 🇫🇷",
        us: "United States 🇺🇸",
        uk: "United Kingdom 🇬🇧",
        de: "Germany 🇩🇪",
        es: "Spain 🇪🇸",
        it: "Italy 🇮🇹"
      },
      currencies: {
        EUR: "EUR (€)",
        USD: "USD ($)",
        GBP: "GBP (£)"
      }
    },
    Update: {
      loading: "Loading ad data...",
      title: "Update your ad",
      sections: {
        basicInfo: "Basic Information",
        physicalDetails: "Physical Details",
        rates: "Rates",
        services: "Services",
        contacts: "Contacts",
        description: "Description",
        categories: "Categories",
        media: "Media"
      },
      fields: {
        adTitle: "Ad title",
        required: "Required",
        age: "Age",
        height: "Height (cm)",
        weight: "Weight (kg)",
        bust: "Bust",
        currency: "Currency",
        thirtyMinutes: "30 min rate",
        oneHour: "1 hour rate",
        twoHours: "2 hour rate",
        fullNight: "Overnight rate",
        phoneNumber: "Phone number",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        instagram: "Instagram",
        twitter: "Twitter/X",
        description: "Description"
      },
      placeholders: {
        adTitle: "e.g. Beautiful Jasmine - Available in Paris",
        city: "Enter your city",
        selectAge: "Select age",
        selectHeight: "Select height",
        selectWeight: "Select weight",
        selectBust: "Select",
        phoneNumber: "+33 6 12 34 56 78",
        whatsapp: "+33 6 12 34 56 78",
        telegram: "@username",
        instagram: "@username",
        twitter: "@username",
        description: "Describe your services..."
      },
      messages: {
        loginRequired: "You must be logged in to perform this action.",
        adIdMissing: "Ad ID missing.",
        escortOnly: "Action reserved for escorts only.",
        cityRequired: "Please select a city",
        updateSuccess: "Ad updated successfully!",
        updateError: "Failed to update ad",
        loadError: "Failed to load ad data",
        currentImages: "Current images",
        currentVideo: "Current video",
        uploadNewImages: "Upload new images (max 10)",
        uploadVideo: "Upload a video",
        imagesUploaded: "images uploaded",
        uploadButton: "Upload"
      },
      buttons: {
        update: "Update ad",
        updating: "Updating..."
      },
      categories: {
        analSex: "Anal sex",
        asianGirls: "Asian girls",
        bbw: "BBW",
        bigTits: "Big tits",
        blonde: "Blonde",
        brunette: "Brunette",
        cim: "CIM",
        ebony: "Ebony",
        eroticMassage: "Erotic massage",
        europeanGirls: "European girls",
        kissing: "Kissing",
        latinaGirls: "Latina girls",
        mature: "Mature",
        vipGirls: "VIP girls"
      },
      services: {
        analSex: "Anal sex",
        oralWithoutCondom: "Oral without condom",
        kissing: "Kissing",
        cunnilingus: "Cunnilingus",
        cumInMouth: "Cum in mouth (CIM)",
        cumInFace: "Cum in face (CIF)",
        cumOnBody: "Cum on body (COB)",
        eroticMassage: "Erotic massage",
        striptease: "Striptease",
        goldenShower: "Golden shower"
      },
      contactSections: {
        phone: "Phone number",
        messengers: "Social media & Messaging apps"
      },
      options: {
        years: "years old",
        yes: "Yes",
        no: "No",
        select: "Select"
      },
      currentMedia: {
        description: "These are your current media files. Upload new media below to add or replace them."
      }
    },
    Blacklist: {
      pageTitle: "Blacklist Management",
      pageSubtitle: "Manage clients you want to block",
      description: "Blacklisted clients will no longer be able to see your profile, contact you, or access your information.",
      access: {
        denied: "Access denied",
        escortOnly: "Access reserved for escorts",
        permissionError: "Error verifying permissions",
        goHome: "Back to homepage"
      },
      search: {
        title: "Search for a client to blacklist",
        placeholder: "Enter a username",
        noResults: "No clients found",
        loading: "Searching..."
      },
      blacklisted: {
        title: "Blacklisted clients",
        empty: "No blacklisted clients",
        emptySubtitle: "Use the search above to blacklist clients",
        refresh: "Refresh",
        blacklisted: "Blacklisted",
        since: "Since",
        registeredOn: "Registered on",
        unknownUser: "Unknown user"
      },
      buttons: {
        block: "Block",
        blocking: "Blocking...",
        unblock: "Unblock",
        unblocking: "Unblocking...",
        confirmUnblock: "Are you sure you want to remove this user from your blacklist?",
        search: "Search",
        refresh: "Refresh"
      },
      messages: {
        success: {
          block: "has been added to your blacklist",
          unblock: "has been removed from your blacklist"
        },
        error: {
          alreadyBlacklisted: "This user is already blacklisted",
          block: "Error blocking user",
          unblock: "Error unblocking user",
          search: "Error during search",
          load: "Error loading blacklist",
          generic: "An error occurred"
        }
      },
      info: {
        title: "About the blacklist",
        points: {
          p1: "Blacklisted clients will no longer see your profile",
          p2: "They will no longer be able to contact you via chat",
          p3: "Your ads will no longer be visible to them",
          p4: "You can unblock a client at any time",
          p5: "The client is not notified when blacklisted"
        }
      },
      loading: "Loading...",
      loadingBlacklist: "Loading blacklist..."
    },
    Messages: {
      pageTitle: "Messages",
      searchPlaceholder: "Search a conversation...",
      emptyStates: {
        noConversations: "No conversations",
        noMessages: "No messages",
        firstMessage: "Send your first message!",
        selectConversation: "No conversation selected",
        selectPrompt: "Select a conversation to start chatting",
        loginRequired: "You must be logged in to access messages"
      },
      conversation: {
        online: "Online",
        offline: "Offline",
        userTypes: {
          escort: "Escort",
          client: "Client",
          admin: "Admin"
        },
        you: "You: ",
        newConversation: "New conversation",
        markAsRead: "Mark as read"
      },
      dates: {
        today: "Today",
        yesterday: "Yesterday",
        unknownDate: "Unknown date",
        unknownTime: "--:--"
      },
      messages: {
        inputPlaceholder: "Type your message...",
        sending: "Sending...",
        sendError: "Error sending message",
        readError: "Error reading message",
        loading: "Loading messages...",
        loadingConversations: "Loading conversations..."
      },
      actions: {
        newConversation: "New conversation",
        send: "Send",
        attach: "Attach file",
        call: "Call",
        menu: "Menu",
        back: "Back"
      },
      status: {
        unread: "Unread",
        read: "Read",
        sending: "Sending..."
      },
      loading: "Loading...",
      online: "Online",
      offline: "Offline"
    },
  },
  EscortCard: {
    verified: "VERIFIED",
    online: "Online",
    noPhotos: "No photos",
    escortIn: "Escort in:",
    age: "Age",
    bust: "Bust",
    height: "Height",
    weight: "Weight",
    services: "Services",
    yes: "Yes",
    no: "No",
    years: "years old",
    cm: "cm",
    kg: "kg",
    lbs: "lbs",
    photos: "photos",
    rating: "Rating",
    reviews: "reviews",
    favorite: "Favorite",
    contact: "Contact",
    review: "Review",
    chat: "Chat",
    call: "Call",
    message: "Message",
    priceOnRequest: "On request",
    recently: "Recently",
    verifiedBadge: "VERIFIED",
    onlineBadge: "Online",
    imageCount: "images",
    heightFormat: "cm / ",
    weightFormat: "kg / ",
    escortTitle: "Escort in"
  },
  FavoriteButton: {
    messages: {
      loginRequired: "You must be logged in to add to favorites",
      clientOnly: "Only clients can add to favorites",
      adIdMissing: "Ad ID missing",
      addedToFavorites: "Added to favorites",
      removedFromFavorites: "Removed from favorites",
      alreadyInFavorites: "This ad is already in your favorites",
      genericError: "An error occurred",
      loginToAdd: "Log in to add to favorites"
    },
    tooltips: {
      addToFavorites: "Add to favorites",
      removeFromFavorites: "Remove from favorites"
    },
    loading: "Loading..."
  },
  GallerySection: {
    defaultTitle: "Gallery",
    photoCount: "photo",
    photosCount: "photos",
    photoNumber: "Photo",
    zoomPhoto: "Zoomed photo",
    close: "Close",
    previous: "Previous photo",
    next: "Next photo",
    currentCount: "of",
    watermark: "Lovira",
    imageAlt: "Gallery image",
    zoomIn: "Zoom",
    loading: "Loading gallery...",
    emptyGallery: "No images available",
    navigation: {
      previous: "Previous photo",
      next: "Next photo",
      close: "Close gallery"
    },
  },
  Header: {
    logoAlt: "App logo",
    buttons: {
      language: "Language",
      changeLanguage: "Change language",
      favorites: "Favorites",
      review: "Review",
      chat: "Chat",
      messages: "Messages",
      advertise: "Advertise",
      advertiseFor: "Advertise for",
      profile: "Profile",
      login: "Login",
      logout: "Logout",
      escortDashboard: "Dashboard",
      clientProfile: "Client profile"
    },
    userTypes: {
      escort: "escort",
      client: "client"
    },
    menu: {
      open: "Open menu",
      close: "Close menu"
    },
    flags: {
      us: "United States",
      fr: "France"
    }
  },
  ReviewSection: {
    title: "Customer reviews",
    form: {
      ratingLabel: "Your rating",
      commentPlaceholder: "Share your experience...",
      characters: "characters",
      publish: "Publish review",
      publishing: "Publishing...",
      ratingRequired: "Rating is required",
      commentRequired: "Comment is required",
      commentMinLength: "Comment must be at least 10 characters",
      commentMaxLength: "Comment must not exceed 500 characters"
    },
    reviews: {
      loading: "Loading reviews...",
      empty: "Be the first to leave a review!",
      dateFormat: "on",
      citySeparator: "•",
      anonymous: "Anonymous",
      verified: "Verified",
      edited: "(edited)"
    },
    actions: {
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      confirmDelete: "Delete this review?",
      submit: "Submit",
      update: "Update",
      validate: "Validate"
    },
    messages: {
      success: {
        published: "Review published successfully!",
        updated: "Review updated",
        deleted: "Review deleted"
      },
      error: {
        publish: "Error publishing review",
        update: "Error updating review",
        delete: "Error deleting review",
        generic: "An error occurred",
        fetch: "Error loading reviews"
      },
      validation: {
        ratingRequired: "Please select a rating",
        commentRequired: "Please enter a comment"
      }
    },
    stats: {
      averageRating: "Average rating",
      totalReviews: "reviews",
      fiveStars: "5 stars",
      fourStars: "4 stars",
      threeStars: "3 stars",
      twoStars: "2 stars",
      oneStar: "1 star"
    },
    stars: {
      oneStar: "1 star",
      twoStars: "2 stars",
      threeStars: "3 stars",
      fourStars: "4 stars",
      fiveStars: "5 stars"
    }
  },
  Sidebar: {
    logoAlt: "Lovira logo",
    user: {
      profileAlt: "Profile picture",
      email: "Email",
      username: "Username",
      balance: "Balance"
    },
    navigation: {
      home: "Home",
      settings: "Settings",
      paymentsHistory: "Payment history",
      chat: "Chat",
      blacklist: "Blacklist",
      myAdsByCity: "My ads by city",
      newAdvert: "New ad",
      allAds: "All ads",
      viewAll: "View all",
      createFirstAd: "Create your first ad",
      noAdsYet: "No ads yet",
      getStarted: "Get started"
    },
    buttons: {
      signOut: "Sign out",
      signingOut: "Signing out...",
      close: "Close",
      openMenu: "Open menu",
      toggleSidebar: "Toggle sidebar",
      createAd: "Create ad",
      viewDetails: "View details"
    },
    ads: {
      city: "City",
      adsCount: "ads",
      ad: "Ad",
      adNumber: "Ad #",
      more: "more",
      unknownCity: "Unknown",
      allCities: "All cities",
      adTitle: "Ad title",
      noTitle: "Untitled"
    },
    language: {
      selector: "Language selector",
      englishUS: "English (US)",
      french: "French",
      currentLanguage: "Current language"
    },
    topMenu: {
      postAd: "Post ad",
      balance: "Balance",
      blacklist: "Blacklist",
      notifications: "Notifications"
    },
    messages: {
      signOutSuccess: "User signed out successfully",
      signOutError: "An error occurred while signing out"
    },
    status: {
      loading: "Loading...",
      error: "Error",
      success: "Success"
    },
    PromoBanner: {
      title: "LIMITED TIME OFFER",
      message: "FREE ads and boosts until",
      cta: "Take advantage of the offer",
      date: "March, 2026"
    }
  },
  CityRankingPage: {
    loadingCity: "Loading city...",
    header: {
      title: "Ranking in",
      description: "All ads ranked according to the positioning algorithm",
      myAdsButton: "My ads",
      newAdButton: "New Ad"
    },
    filters: {
      searchPlaceholder: "Search for an ad...",
      sortBy: "Sort by:",
      sortOptions: {
        position: "Position",
        created_at: "Creation date",
        boost_time: "Last boost"
      },
      cityInfo: "City: ",
      displayingAds: "Ads : ",
      refreshButton: "Refresh"
    },
    algorithmLegend: {
      title: "💡 How does the ranking work?",
      boostedAds: "Boosted ads appear before non-boosted ones",
      recentBoost: "Recent boost = better position (sorted by date)",
      noBoost: "No boost = sorted by creation date (newest first)"
    },
    loadingRankings: "Loading rankings...",
    emptyState: {
      title: "No ads found",
      description: "There are no ads in",
      createFirstAdButton: "Create the first ad"
    },
    adCard: {
      // positionBadge: "#{{position}}/{{total}}",
      boostedBadge: "BOOSTED",
      userAdBadge: "Your ad",
      untitledAd: "No title",
      createdOn: "Created on",
      boostedAgo: "Boosted",
      viewDetails: "View details",
      alreadyBoosted: "Already boosted",
      boostAd: "Boost this ad",
      editAd: "Edit",
      noImageAlt: "Ad"
    },
    pagination: {
      previous: "Previous",
      next: "Next"
    },
    algorithmDetails: {
      title: "📊 Detailed ranking algorithm",
      priority1: {
        title: "Priority 1: Boosted ads",
        description: "Ads that have been recently boosted are displayed first. The more recent the boost, the higher the ad is in the ranking."
      },
      priority2: {
        title: "Priority 2: Creation date",
        description: "For non-boosted ads, ranking is done by creation date. The newest ads appear first."
      },
      boostInfo: {
        title: "How to boost your ad?",
        description: "Click on the boost icon to boost your ad. The boost lasts 24h and temporarily places your ad at the top of the ranking."
      }
    },
    loading: {
      spinner: "Loading",
      refreshing: "Refreshing"
    }
  }
} as const;