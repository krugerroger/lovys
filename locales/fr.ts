// locales/fr.ts
export default {
  HomePage: {
    hero: {
      title: "Trouvez les meilleures escorts en ",
      subtitle: "Plateforme de confiance avec plus de 1,765,491 avis vérifiés"
    },
    search: {
      title: "Rechercher une escort",
      city: {
        label: "Ville",
        placeholder: "Sélectionner une ville",
        filterPlaceholder: "Filtrer les villes...",
        noResults: "Aucune ville trouvée pour \"{search}\"",
        recent: "RÉCENTS",
        seeAllCities: "Voir toutes les villes →",
        popularBadge: "Ville populaire",
        availableBadge: "Disponible"
      },
      language: {
        label: "🌍 Langue",
        placeholder: "Choisir la langue"
      },
      searchButton: {
        withCity: "RECHERCHER À {city}",
        withoutCity: "SÉLECTIONNEZ UNE VILLE"
      },
      trustBadges: {
        secure: "Vérification sécurisée",
        reviews: "Avis authentiques"
      }
    },
    categories: {
      title: "Catégories populaires",
      list: {
        vip: "Escort VIP",
        companion: "Compagnie",
        massage: "Massage",
        outcall: "Outcall",
        incall: "Incall",
        new: "Nouvelles escorts",
        verified: "Profils vérifiés",
        independent: "Indépendantes",
        agencies: "Agences",
        duo: "Duo/Trio"
      }
    },
    popularCities: {
      title: "Villes populaires",
      stats: {
        frenchCities: "Villes en France",
        popularCities: "Villes populaires"
      },
      exploreAll: "Explorer toutes les villes"
    },
    recentSearches: {
      title: "Recherches récentes"
    },
    featuredEscorts: {
      title: "Escorts en vedette",
      viewAll: "Voir toutes",
      loading: "Chargement...",
      empty: {
        title: "Aucune escort disponible",
        description: "Les annonces seront bientôt disponibles"
      }
    },
    regions: {
      title: "Découvrez par région",
      citiesCount: "villes",
      seeCity: "Voir {city} →",
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
      verifiedReviews: "Avis vérifiés",
      citiesCovered: "Villes couvertes",
      customerSupport: "Support client",
      verifiedAds: "Annonces vérifiées"
    },
    footer: {
      terms: "En utilisant ce site, vous acceptez nos",
      copyright: "© 2025 Lovira - Tous droits réservés. Service réservé aux adultes (+18 ans).",
      termsLink: "conditions d'utilisation",
      privacyLink: "politique de confidentialité"
    },
  ClientProfile: {
    Chat: {
      title: "Messages",
      conversations: {
        searchPlaceholder: "Rechercher une conversation...",
        noConversations: "Aucune conversation",
        noConversationsDescription: "Commencez une nouvelle conversation pour discuter",
        newConversation: "Nouvelle conversation",
        youPrefix: "Vous: ",
        unreadCount: "{count, plural, one {# message non lu} other {# messages non lus}}",
        today: "Aujourd'hui",
        yesterday: "Hier",
        unknownDate: "Date inconnue",
        online: "En ligne",
        offline: "Hors ligne",
        viewConversations: "Voir les conversations"
      },
      chat: {
        noConversationSelected: "Aucune conversation sélectionnée",
        noConversationSelectedDescription: "Sélectionnez une conversation pour commencer à discuter",
        noMessages: "Aucun message",
        firstMessagePrompt: "Envoyez votre premier message !",
        openingConversation: "Ouverture de la conversation...",
        pleaseWait: "Veuillez patienter",
        typingPlaceholder: "Écrivez votre message...",
        sendButton: "Envoyer",
        sending: "Envoi en cours..."
      },
      userTypes: {
        escort: "Escort",
        client: "Client",
        admin: "Administrateur"
      },
      errors: {
        notAuthenticated: "Vous devez être connecté pour accéder aux messages",
        clientsOnly: "Seuls les clients peuvent contacter des escorts",
        escortNotFound: "Escort non trouvé",
        conversationExists: "La conversation existe déjà",
        sendMessageError: "Erreur lors de l'envoi du message",
        loadError: "Erreur lors du chargement",
        markReadError: "Erreur lors du marquage comme lu"
      },
      loading: {
        conversations: "Chargement des conversations...",
        messages: "Chargement des messages..."
      }
    }
  }
  },
  Auth: {
    SignIn: {
      title: "Bienvenue",
      subtitle: "Connectez-vous pour accéder à votre compte",
      form: {
        email: {
          label: "Adresse email",
          placeholder: "votre.email@exemple.com",
          errors: {
            required: "L'email est requis",
            invalid: "Veuillez entrer une adresse email valide"
          }
        },
        password: {
          label: "Mot de passe",
          placeholder: "Entrez votre mot de passe",
          errors: {
            required: "Le mot de passe est requis"
          },
          show: "Afficher le mot de passe",
          hide: "Masquer le mot de passe"
        },
        forgotPassword: "Mot de passe oublié ?",
        submit: {
          text: "Se connecter",
          loading: "Connexion en cours..."
        }
      },
      register: {
        noAccount: "Vous n'avez pas de compte ?",
        orRegisterAs: "Ou inscrivez-vous en tant que :",
        user: "Utilisateur",
        escort: "Escort"
      },
      features: {
        title: "Fonctionnalités :",
        secureAuth: "Authentification sécurisée",
        personalizedDashboard: "Tableau de bord personnalisé",
        easyAccountManagement: "Gestion simplifiée du compte"
      },
      messages: {
        success: "Connexion réussie ! Bienvenue !",
        error: "Échec de la connexion : {error}",
        genericError: "Une erreur est survenue lors de la connexion. Veuillez réessayer."
      }
    },
    EscortRegistration: {
      title: "Créer un compte d'escort",
      subtitle: "Rejoignez notre plateforme professionnelle",
      fields: {
        username: "Nom d'utilisateur",
        email: "Adresse email",
        password: "Mot de passe",
        confirmPassword: "Confirmer le mot de passe",
        required: "Obligatoire"
      },
      placeholders: {
        username: "Choisissez un nom d'utilisateur",
        email: "votre.email@example.com",
        password: "Créez un mot de passe sécurisé",
        confirmPassword: "Ressaisissez votre mot de passe"
      },
      buttons: {
        createAccount: "Créer un compte d'escort",
        creatingAccount: "Création du compte...",
        showPassword: "Afficher le mot de passe",
        hidePassword: "Masquer le mot de passe",
        signIn: "Se connecter ici",
        switchToLogin: "Connectez-vous à votre compte"
      },
      messages: {
        loginPrompt: "Vous avez déjà un compte ?",
        agreeTerms: "En vous inscrivant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité",
        success: "Compte d'escort créé avec succès ! 🎉",
        successDescription: "Bienvenue sur notre plateforme !",
        emailVerificationSent: "Compte créé avec succès ! 🎉",
        emailVerificationDescription: "Veuillez vérifier votre email pour confirmer votre compte.",
        registrationFailed: "Échec de l'inscription",
        genericError: "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
      },
      errors: {
        usernameRequired: "Le nom d'utilisateur est requis",
        usernameTooShort: "Le nom d'utilisateur doit contenir au moins 3 caractères",
        emailRequired: "L'email est requis",
        emailInvalid: "Veuillez entrer une adresse email valide",
        passwordRequired: "Le mot de passe est requis",
        passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
        confirmPasswordRequired: "Veuillez confirmer votre mot de passe",
        passwordsMismatch: "Les mots de passe ne correspondent pas"
      },
      benefits: {
        title: "Avantages pour les escorts",
        quickSetup: {
          title: "Configuration rapide",
          description: "Commencez en quelques minutes avec notre processus d'inscription simple."
        },
        unlimitedAds: {
          title: "Annonces illimitées",
          description: "Publiez autant d'annonces que nécessaire pour vos services."
        },
        largeClientBase: {
          title: "Grande base de clients",
          description: "Accédez à des milliers de clients vérifiés à la recherche de services."
        }
      }
    },
  },
  EscortRegistration: {
    pageTitle: "Créer un compte Escort",
    pageSubtitle: "Rejoignez notre plateforme professionnelle",
    
    form: {
      username: {
        label: "Nom d'utilisateur",
        placeholder: "Choisissez un nom d'utilisateur",
        required: "Le nom d'utilisateur est requis",
        minLength: "Le nom d'utilisateur doit contenir au moins 3 caractères"
      },
      email: {
        label: "Adresse email",
        placeholder: "votre.email@example.com",
        required: "L'email est requis",
        invalid: "Veuillez entrer une adresse email valide"
      },
      password: {
        label: "Mot de passe",
        placeholder: "Créez un mot de passe sécurisé",
        required: "Le mot de passe est requis",
        minLength: "Le mot de passe doit contenir au moins 6 caractères"
      },
      confirmPassword: {
        label: "Confirmer le mot de passe",
        placeholder: "Ressaisissez votre mot de passe",
        required: "Veuillez confirmer votre mot de passe",
        noMatch: "Les mots de passe ne correspondent pas"
      },
      requiredField: "*"
    },
    
    buttons: {
      submit: "Créer un compte Escort",
      submitting: "Création du compte...",
      signIn: "Se connecter ici"
    },
    
    messages: {
      accountCreated: "Compte créé avec succès ! 🎉",
      verifyEmail: "Veuillez vérifier votre email pour activer votre compte.",
      welcome: "Bienvenue sur notre plateforme !",
      registrationFailed: "Échec de l'inscription",
      errorOccurred: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
      alreadyHaveAccount: "Vous avez déjà un compte ?"
    },
    
    benefits: {
      title: "Avantages pour les Escorts",
      quickSetup: {
        title: "Configuration rapide",
        description: "Commencez en quelques minutes avec notre processus d'inscription simple."
      },
      unlimitedAds: {
        title: "Annonces illimitées",
        description: "Publiez autant d'annonces que vous le souhaitez pour vos services."
      },
      largeClientBase: {
        title: "Large base de clients",
        description: "Accédez à des milliers de clients vérifiés à la recherche de services."
      }
    }
  },
  ClientRegistration: {
    form: {
      username: {
        label: "Votre nom ou pseudo",
        placeholder: "Choisissez un nom d'utilisateur",
        required: "Le nom d'utilisateur est requis",
        minLength: "Le nom d'utilisateur doit contenir au moins 3 caractères"
      },
      email: {
        label: "Adresse email",
        placeholder: "votre.email@example.com",
        required: "L'email est requis",
        invalid: "Veuillez entrer une adresse email valide"
      },
      password: {
        label: "Mot de passe",
        placeholder: "Créez un mot de passe sécurisé",
        required: "Le mot de passe est requis",
        minLength: "Le mot de passe doit contenir au moins 6 caractères"
      },
      confirmPassword: {
        label: "Confirmer le mot de passe",
        placeholder: "Ressaisissez votre mot de passe",
        required: "Veuillez confirmer votre mot de passe",
        noMatch: "Les mots de passe ne correspondent pas"
      },
      requiredField: "*"
    },
    
    buttons: {
      submit: "Créer mon compte",
      submitting: "Création du compte...",
      signIn: "Se connecter ici"
    },
    
    messages: {
      accountCreated: "Compte créé avec succès ! 🎉",
      userAccountCreated: "Compte client créé avec succès ! 🎉",
      verifyEmail: "Veuillez vérifier votre email pour activer votre compte.",
      welcome: "Bienvenue sur notre plateforme !",
      registrationFailed: "Échec de l'inscription",
      errorOccurred: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
      alreadyHaveAccount: "Vous avez déjà un compte ?"
    },
    
    benefits: {
      title: "Avantages pour les Clients",
      freeChat: {
        title: "Chat privé gratuit",
        description: "Communiquez directement avec les prestataires de services dans un environnement sécurisé."
      },
      verifiedProfiles: {
        title: "Profils vérifiés",
        description: "Parcourez des prestataires de services vérifiés et de confiance."
      },
      securePlatform: {
        title: "Plateforme sécurisée",
        description: "Votre confidentialité et votre sécurité sont notre priorité absolue."
      }
    }
  },
  Profile: {
    Favorites: {
      // En-tête
      title: "Mes Favoris",
      subtitle: "{{count}} escort dans vos favoris",
      subtitle_plural: "{{count}} escorts dans vos favoris",
      
      // Actions principales
      actions: {
        refresh: "Rafraîchir",
        refreshing: "Rafraîchissement...",
        allCities: "Toutes les villes",
        removeAll: "Supprimer tous les favoris",
        removeAllConfirm: "Êtes-vous sûr de vouloir supprimer tous vos favoris ?",
        backToAds: "← Retour aux annonces",
        removeFromFavorites: "Retirer des favoris"
      },
      
      // Statistiques
      stats: {
        totalFavorites: "Total favoris",
        cities: "Villes",
        maxPhotos: "Photos max",
        lastAdded: "Dernier ajout",
        noDate: "Aucun"
      },
      
      // États vides
      empty: {
        noFavorites: "Aucun favori",
        noFavoritesDescription: "Ajoutez des escorts à vos favoris en cliquant sur l'icône cœur dans les annonces",
        noFavoritesInCity: "Aucun favori dans cette ville",
        noFavoritesInCityDescription: "Aucun favori trouvé pour la ville sélectionnée",
        browseAds: "Parcourir les annonces"
      },
      
      // Filtres
      filters: {
        filterLabel: "Filtre :",
        adCount: "{{count}} annonce",
        adCount_plural: "{{count}} annonces",
        clearFilter: "Effacer le filtre"
      },
      
      // Carte d'annonce
      card: {
        unknownCity: "Inconnue",
        noName: "Escort Sans Nom",
        noDescription: "Aucune description disponible",
        photosCount: "{{count}} photo",
        photosCount_plural: "{{count}} photos",
        rateNotSpecified: "Tarif non spécifié",
        ratePerHour: "€{{rate}}/h",
        viewAd: "Voir l'annonce",
        viewCity: "Voir la ville",
        addedOn: "Ajouté le",
        addedAt: "à"
      },
      
      // Conseils d'organisation
      tips: {
        title: "Conseils d'organisation",
        sortTitle: "Trier vos favoris",
        sortByCity: "Par ville pour trouver rapidement",
        sortByDate: "Par date d'ajout (les plus récents d'abord)",
        sortByRate: "Par tarif pour respecter votre budget",
        quickActionsTitle: "Actions rapides",
        removeAction: "Cliquez sur l'icône cœur pour retirer un favori",
        filterAction: "Utilisez le filtre par ville pour mieux organiser",
        noteAction: "Notez les annonces pour mieux les retrouver"
      },
      
      // Chargement et erreurs
      loading: {
        redirecting: "Redirection vers la page de connexion...",
        loadingFavorites: "Chargement de vos favoris..."
      }
    },
    Settings: {
        title: "Paramètres du profil",
        subtitle: "Gérez vos informations personnelles",
        email: "Email",
        emailHelper: "Un email de confirmation sera envoyé si vous changez votre adresse",
        username: "Nom d'utilisateur",
        changePassword: "Changer le mot de passe",
        newPassword: "Nouveau mot de passe",
        newPasswordPlaceholder: "Minimum 6 caractères",
        currentPassword: "Mot de passe actuel",
        currentPasswordPlaceholder: "Requis pour changer le mot de passe",
        save: "Enregistrer",
        saving: "Enregistrement...",
        contactAdmin: "Contacter l'administrateur",
        deleteAccount: "Supprimer le compte ?",
        deleteAccountMessage: "Veuillez envoyer un message à {email} pour demander la suppression du compte",
        goHome: "Accueil",
        backToHome: "Retour à l'accueil",
        saveChanges: "Sauvegarder les modifications",
        messages: {
          loginRequired: "Vous devez être connecté",
          usernameRequired: "Le nom d'utilisateur est requis",
          currentPasswordRequired: "Vous devez fournir votre mot de passe actuel pour en définir un nouveau",
          passwordLength: "Le nouveau mot de passe doit contenir au moins 6 caractères",
          currentPasswordIncorrect: "Mot de passe actuel incorrect",
          updateSuccess: "Profil mis à jour avec succès",
          updateError: "Erreur lors de la mise à jour du profil",
          emailConfirmationSent: "Un email de confirmation a été envoyé à votre nouvelle adresse"
        }
    },
      Chat: {
      title: "Messages",
      
      errors: {
        notAuthenticated: "Vous devez être connecté pour accéder à cette page",
        clientsOnly: "Seuls les clients peuvent initier des conversations",
        escortNotFound: "Escort introuvable",
        conversationExists: "Une conversation existe déjà",
        loadError: "Erreur lors du chargement",
        sendMessageError: "Erreur lors de l'envoi du message",
        markReadError: "Erreur lors du marquage comme lu"
      },
      
      conversations: {
        today: "Aujourd'hui",
        yesterday: "Hier",
        unknownDate: "Date inconnue",
        viewConversations: "Voir les conversations",
        searchPlaceholder: "Rechercher une conversation...",
        noConversations: "Aucune conversation",
        noConversationsDescription: "Commencez une nouvelle conversation avec un prestataire",
        newConversation: "Nouvelle conversation",
        youPrefix: "Vous : ",
        unreadCount: "{{count}} nouveau",
        unreadCount_plural: "{{count}} nouveaux",
        online: "En ligne",
        offline: "Hors ligne"
      },
      
      loading: {
        conversations: "Chargement des conversations...",
        messages: "Chargement des messages..."
      },
      
      chat: {
        openingConversation: "Ouverture de la conversation...",
        pleaseWait: "Veuillez patienter",
        noConversationSelected: "Sélectionnez une conversation",
        noConversationSelectedDescription: "Choisissez une conversation dans la liste pour commencer à discuter",
        noMessages: "Aucun message pour le moment",
        firstMessagePrompt: "Envoyez le premier message pour démarrer la conversation",
        typingPlaceholder: "Tapez votre message...",
        sending: "Envoi en cours...",
        sendButton: "Envoyer le message"
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
      // En-tête
      title: "Escorts à {{city}}",
      subtitle: "{{count}} annonce vérifiée • Classées par pertinence",
      subtitle_plural: "{{count}} annonces vérifiées • Classées par pertinence",
      searching: "Recherche d'annonces en cours...",
      
      // Statistiques
      stats: {
        totalAds: "Total annonces",
        top3: "TOP 3",
        top10: "TOP 10",
        boosted: "Boostées"
      },
      
      // Légende du classement
      legend: {
        title: "Légende du classement :",
        top1: "TOP 1",
        top2: "TOP 2",
        top3: "TOP 3",
        top10: "TOP 10",
        others: "Autres positions"
      },
      
      // État vide
      empty: {
        title: "Aucune annonce trouvée",
        description: "Aucune escort n'est encore enregistrée à {city}. Soyez le premier à créer une annonce !"
      },
      
      // Informations de la carte
      card: {
        position: "Position {{rank}}/{{total}}",
        boosted: "⬆ Boostée",
        addedOn: "Ajoutée le"
      },
      
      // Section "À propos"
      about: {
        title: "À propos du classement",
        howRanked: {
          title: "Comment sont classées les annonces ?",
          recentlyBoosted: "Les annonces récemment boostées remontent en haut",
          recentAds: "Les annonces récentes sont favorisées",
          boostDecay: "Le boost s'affaiblit après 24 heures"
        },
        tips: {
          title: "Conseils pour améliorer votre position",
          useBoost: "Utilisez la fonction Remonter pour apparaître en TOP 1",
          updateRegularly: "Mettez à jour régulièrement votre annonce",
          addPhotos: "Ajoutez des photos de qualité"
        }
      },
      
      // Pagination
      pagination: {
        previous: "← Précédent",
        next: "Suivant →"
      },
      
      // Villes voisines
      nearby: {
        title: "Explorez d'autres villes",
        viewAll: "Voir toutes les villes →"
      },
      load: {
        loadMore: "Voir plus",
        showing: "Affichage de",
        of: "sur",
        ads: "annonces"
      }
    },
    ProfilePage: {
      // En-tête
      verified: "Vérifiée",
      online: "En ligne",
      offline: "Hors ligne",
      
      // État non trouvé
      notFound: {
        title: "Annonce non trouvée",
        description: "Cette annonce n'existe pas ou n'est plus disponible",
        backButton: "← Retour aux annonces de {{city}}"
      },
      
      // Sections principales
      about: {
        title: "À propos",
        noDescription: "Aucune description fournie.",
        characteristics: "Caractéristiques",
        servicesOffered: "Services proposés"
      },
      
      // Détails physiques
      physicalDetails: {
        age: "Âge",
        ageUnit: "ans",
        height: "Taille",
        heightUnit: "cm",
        weight: "Poids",
        weightUnit: "kg",
        bust: "Poitrine"
      },
      
      // Services
      services: {
        analSex: "Sexe anal",
        oralWithoutCondom: "Oral sans préservatif",
        kissing: "Bisous",
        cunnilingus: "Cunnilingus",
        cumInMouth: "Cum in mouth (CIM)",
        cumInFace: "Cum in face (CIF)",
        cumOnBody: "Cum on body (COB)",
        eroticMassage: "Massage érotique",
        striptease: "Striptease",
        goldenShower: "Golden shower"
      },
      
      // Contacts
      contacts: {
        title: "Contacts",
        phone: "Téléphone",
        email: "Email",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        instagram: "Instagram"
      },
      
      // Galerie
      gallery: {
        title: "Galerie photos"
      },
      
      // Vidéo
      video: {
        title: "Vidéo de l'escort",
        notSupported: "Votre navigateur ne supporte pas la lecture de vidéos.",
        label: "Vidéo"
      },
      
      // Annonces similaires
      similar: {
        title: "Autres escorts à {{city}}",
        startingFrom: "À partir de"
      },
      
      // Sidebar contact
      contact: {
        title: "Contacter",
        sendMessage: "Envoyer un message"
      },
      
      // Tarifs
      rates: {
        title: "Tarifs",
        thirtyMinutes: "30 minutes",
        oneHour: "1 heure",
        twoHours: "2 heures",
        fullNight: "Nuit complète"
      },
      
      // Informations pratiques
      info: {
        title: "Informations",
        status: "Statut",
        lastUpdate: "Dernière mise à jour",
        backToAds: "← Retour aux annonces"
      }
    },
    CategoryPage: {
    // Breadcrumb
    breadcrumb: {
      categories: "Catégories"
    },
    
    // En-tête
    header: {
      title: "Escorts {{category}}",
      profiles: "Profils",
      cities: "Villes",
      topCities: "Top villes"
    },
    
    // Filtres
    filters: {
      filterByCity: "Filtrer par ville :",
      moreOthers: "+{{count}} autres",
      sortBy: {
        newest: "Nouveautés",
        priceAsc: "Prix croissant",
        priceDesc: "Prix décroissant",
        popular: "Populaires"
      }
    },
    
    // État vide
    empty: {
      title: "Aucune annonce trouvée",
      description: "Aucune escort ne correspond actuellement à la catégorie \"{{category}}\". Revenez bientôt ou explorez d'autres catégories.",
      viewAllCategories: "← Voir toutes les catégories",
      backHome: "Retour à l'accueil"
    },
    
    // Pagination
    pagination: {
      previous: "← Précédent",
      next: "Suivant →"
    },
    
    // Catégories similaires
    similar: {
      title: "Catégories similaires",
      viewAll: "Voir toutes →"
    },
    
    // Section "À propos"
    about: {
      title: "À propos des escorts {{category}}",
      description1: "La catégorie \"{{category}}\" regroupe des escorts qui correspondent spécifiquement à ce critère. Chaque profil a été vérifié manuellement pour assurer la correspondance avec la catégorie.",
      description2: "Pour trouver exactement ce que vous cherchez, utilisez les filtres de ville et de tri disponibles. Vous pouvez également combiner cette catégorie avec d'autres critères de recherche.",
      verifiedProfiles: "Profils vérifiés",
      activeAds: "{{count}} annonces actives",
      activeAds_plural: "{{count}} annonces actives",
      citiesAvailable: "{{count}} villes disponibles",
      citiesAvailable_plural: "{{count}} villes disponibles"
    },
    
    // Conseils
    tips: {
      searchTip: {
        title: "Astuce recherche",
        description: "Combinez cette catégorie avec une ville spécifique pour affiner vos résultats."
      },
      verifiedProfiles: {
        title: "Profils vérifiés",
        description: "Toutes les annonces sont vérifiées pour garantir l'authenticité des profils."
      },
      updates: {
        title: "Mises à jour",
        description: "De nouvelles annonces sont ajoutées quotidiennement dans cette catégorie."
      }
    }
    }
  },
  Manage: {
    CityAdsPage: {
      loading: "Chargement des annonces...",
      pageTitle: "Mes annonces à",
      pageSubtitle: "Gérez toutes vos annonces dans cette ville",
      stats: {
        totalAds: "Annonces totales",
        approved: "Approuvées",
        pending: "En attente",
        averagePrice: "Prix moyen",
        approvedRate: "Taux d'approbation",
        lastUpdated: "Dernière mise à jour"
      },
      actions: {
        newAdInCity: "Nouvelle annonce à",
        newAdOtherCity: "Nouvelle annonce dans une autre ville",
        createFirstAd: "Créer une première annonce",
        viewAllAds: "Voir toutes mes annonces",
        viewAllCities: "Voir toutes les villes",
        createAnotherAd: "Créer une autre annonce"
      },
      filters: {
        searchPlaceholder: "Rechercher dans vos annonces...",
        status: {
          all: "Tous les statuts",
          active: "Actives uniquement",
          pending: "En attente uniquement"
        },
        sort: {
          recent: "Plus récentes",
          price_asc: "Prix : croissant",
          price_desc: "Prix : décroissant"
        }
      },
      emptyState: {
        title: "Aucune annonce à",
        subtitle: "Créez votre première annonce dans",
        description: "pour commencer à attirer des clients dans cette région."
      },
      adCard: {
        untitled: "Annonce sans titre",
        noDescription: "Aucune description fournie.",
        perHour: "/ heure",
        thirtyMinutes: "30min :",
        photos: "photos",
        views: "vues",
        viewDetails: "Voir les détails",
        menu: {
          editAd: "Modifier l'annonce",
          preview: "Aperçu",
          duplicate: "Dupliquer",
          delete: "Supprimer"
        }
      },
      badges: {
        approved: "Approuvée",
        pending: "En attente",
        rejected: "Rejetée",
        draft: "Brouillon"
      },
      performance: {
        title: "Résumé des performances",
        description: "Gérez efficacement vos annonces pour maximiser la visibilité et les réservations dans"
      },
      messages: {
        deleteConfirm: "Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.",
        deleteSuccess: "Annonce supprimée avec succès",
        deleteError: "Échec de la suppression de l'annonce",
        duplicateSuccess: "Annonce dupliquée avec succès",
        duplicateError: "Échec de la duplication de l'annonce",
        notFound: "Annonce non trouvée"
      },
    },
    CityAdIDPage: {
        notFound: {
          title: "Annonce non trouvée",
          description: "L'annonce avec l'ID n'existe pas ou vous n'y avez pas accès.",
          backToAds: "Retour à mes annonces"
        },
        header: {
          title: "Gestion à",
          position: "Position",
          total: "sur"
        },
        rank: {
          title: "Classement actuel",
          currentRank: "Classement à",
          position: "Position",
          totalAds: "Total annonces",
          status: "Statut",
          excellent: "Excellent",
          good: "Bon",
          toImprove: "À améliorer",
          topOne: "🏆 TOP 1",
          topTwo: "🥈 TOP 2",
          topThree: "🥉 TOP 3",
          topNumber: "TOP"
        },
        loading: "Chargement...",
        error: {
          title: "Erreur de chargement",
          message: "Impossible de calculer la position."
        },
        lastBoost: {
          title: "Dernier remontage",
          active: "✓ Actif",
          justNow: "à l'instant",
          hoursAgo: "il y a",
          hourAgo: "il y a 1h",
          daysAgo: "il y a"
        },
        actions: {
          title: "Actions",
          editProfile: "Éditer le profil",
          editDescription: "Modifier vos informations",
          deleteAd: "Supprimer l'annonce",
          deleteDescription: "Supprimer définitivement cette annonce"
        },
        boost: {
          title: "Remonter à",
          subtitle: "Passez en position #1 dans cette ville",
          feature1: "Position #1 garantie",
          feature1Desc: "Immédiatement après remontage",
          feature2: "Boost récent prioritaire",
          feature2Desc: "Les plus récents sont affichés en premier",
          button: "REMONTER MAINTENANT",
          buttonRe: "RE-REMONTER",
          buttonLoading: "Remontage en cours...",
          currentPosition: "Position actuelle :",
          noAdsFound: "Aucune annonce trouvée à",
          beFirst: "Soyez la première à vous inscrire !"
        },
        howItWorks: {
          title: "Comment est calculé votre rang ?",
          step1: "Annonces boostées",
          step1Desc: "En premier, triées par date de boost (plus récent d'abord)",
          step2: "Annonces non boostées",
          step2Desc: "Ensuite, triées par date de création (plus récent d'abord)",
          step3: "Priorité",
          step3Desc: "Boostées récentes > Boostées anciennes > Non boostées récentes",
          step4: "Boost immédiat",
          step4Desc: "Un remontage vous place automatiquement en position #1"
        },
        messages: {
          boostError: "Impossible de trouver l'ID de l'annonce",
          boostSuccess: "Remontée à réussie !",
          boostConnectionError: "Erreur de connexion",
          boostGenericError: "Une erreur est survenue",
          dateInvalid: "Date invalide",
          deleteError: "Impossible de supprimer l'annonce",
          deleteConfirm: "Êtes-vous sûr de vouloir supprimer l'annonce \"{title}\" de {city} ? Cette action est irréversible.",
          deleteSuccess: "Annonce supprimée avec succès",
          deleteGenericError: "Échec de la suppression",
          deleteConnectionError: "Erreur de connexion"
        },
    },
    Create: {
      title: "Créer une annonce",
      sections: {
        basicInfo: "Informations de base",
        location: "Localisation",
        physicalDetails: "Détails physiques",
        rates: "Tarifs",
        services: "Services",
        contacts: "Contacts",
        description: "Description",
        categories: "Catégories",
        media: "Médias"
      },
      fields: {
        adTitle: "Titre de l'annonce",
        required: "Obligatoire",
        country: "Pays",
        city: "Ville",
        age: "Âge",
        height: "Taille (cm)",
        weight: "Poids (kg)",
        bust: "Poitrine",
        currency: "Devise",
        thirtyMinutes: "Tarif de 30 min",
        oneHour: "Tarif de 1 heure",
        twoHours: "Tarif de 2 heures",
        fullNight: "Tarif de la nuit",
        phoneNumber: "Numéro de téléphone",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        instagram: "Instagram",
        twitter: "Twitter/X",
        description: "Description"
      },
      placeholders: {
        adTitle: "ex: Belle Jasmine - Disponible à Paris",
        selectCity: "Sélectionnez une ville...",
        searchCity: "Rechercher une ville...",
        selectAge: "Sélectionnez un âge",
        selectHeight: "Sélectionnez votre taille",
        selectWeight: "Sélectionnez votre poids",
        selectBust: "Sélectionnez",
        thirtyMinutes: "Tarif de 30min",
        oneHour: "Tarif de 1h",
        twoHours: "Tarif de 2h",
        fullNight: "Tarif d'une nuit",
        phoneNumber: "+33 6 12 34 56 78",
        whatsapp: "+33 6 12 34 56 78",
        telegram: "@nomdutilisateur",
        instagram: "@nomdutilisateur",
        twitter: "@nomdutilisateur",
        description: "Décrivez vos services..."
      },
      messages: {
        loginRequired: "Vous devez être connecté",
        escortOnly: "Seules les escorts peuvent créer des annonces",
        cityRequired: "Veuillez sélectionner au moins une ville",
        submitSuccess: "Annonce soumise avec succès !",
        submitError: "Échec de la soumission de l'annonce",
        citiesAvailable: "villes disponibles",
        noCitiesFound: "Aucune ville trouvée",
        citySelected: "ville sélectionnée",
        noCitySelected: "Aucune ville sélectionnée",
        uploadImages: "Télécharger des images",
        imagesUploaded: "images téléchargées",
        uploadVideo: "Télécharger une vidéo",
        uploadButton: "Télécharger"
      },
      buttons: {
        publish: "Publier l'annonce",
        publishing: "Soumission en cours...",
        done: "Terminé",
        clear: "Effacer",
        selectParis: "Paris",
        selectLyon: "Lyon",
        selectMarseille: "Marseille"
      },
      categories: {
        analSex: "Sexe anal",
        asianGirls: "Filles asiatiques",
        bbw: "BBW",
        bigTits: "Gros seins",
        blonde: "Blonde",
        brunette: "Brune",
        cim: "CIM",
        ebony: "Ebène",
        eroticMassage: "Massage érotique",
        europeanGirls: "Filles européennes",
        kissing: "Bisous",
        latinaGirls: "Filles latines",
        mature: "Mature",
        vipGirls: "Filles VIP"
      },
      services: {
        analSex: "Sexe anal",
        oralWithoutCondom: "Oral sans préservatif",
        kissing: "Bisous",
        cunnilingus: "Cunnilingus",
        cumInMouth: "Éjaculation dans la bouche (CIM)",
        cumInFace: "Éjaculation sur le visage (CIF)",
        cumOnBody: "Éjaculation sur le corps (COB)",
        eroticMassage: "Massage érotique",
        striptease: "Striptease",
        goldenShower: "Douche dorée"
      },
      contactSections: {
        phone: "Numéro de téléphone",
        messengers: "Réseaux sociaux & Messageries"
      },
      options: {
        years: "ans",
        yes: "Oui",
        no: "Non",
        select: "Sélectionnez"
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
      loading: "Chargement des données de l'annonce...",
      title: "Mettre à jour votre annonce",
      sections: {
        basicInfo: "Informations de base",
        physicalDetails: "Détails physiques",
        rates: "Tarifs",
        services: "Services",
        contacts: "Contacts",
        description: "Description",
        categories: "Catégories",
        media: "Médias"
      },
      fields: {
        adTitle: "Titre de l'annonce",
        required: "Obligatoire",
        age: "Âge",
        height: "Taille (cm)",
        weight: "Poids (kg)",
        bust: "Poitrine",
        currency: "Devise",
        thirtyMinutes: "Tarif 30 min",
        oneHour: "Tarif 1 heure",
        twoHours: "Tarif 2 heures",
        fullNight: "Tarif nuitée",
        phoneNumber: "Numéro de téléphone",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        instagram: "Instagram",
        twitter: "Twitter/X",
        description: "Description"
      },
      placeholders: {
        adTitle: "ex: Belle Jasmine - Disponible à Paris",
        city: "Entrez votre ville",
        selectAge: "Sélectionnez l'âge",
        selectHeight: "Sélectionnez la taille",
        selectWeight: "Sélectionnez le poids",
        selectBust: "Sélectionnez",
        phoneNumber: "+33 6 12 34 56 78",
        whatsapp: "+33 6 12 34 56 78",
        telegram: "@nomdutilisateur",
        instagram: "@nomdutilisateur",
        twitter: "@nomdutilisateur",
        description: "Décrivez vos services..."
      },
      messages: {
        loginRequired: "Vous devez être connecté pour effectuer cette action.",
        adIdMissing: "ID de l'annonce manquant.",
        escortOnly: "Action réservée uniquement aux escorts.",
        cityRequired: "Veuillez sélectionner une ville",
        updateSuccess: "Annonce mise à jour avec succès !",
        updateError: "Échec de la mise à jour de l'annonce",
        loadError: "Échec du chargement des données de l'annonce",
        currentImages: "Images actuelles",
        currentVideo: "Vidéo actuelle",
        uploadNewImages: "Télécharger de nouvelles images (max 10)",
        uploadVideo: "Télécharger une vidéo",
        imagesUploaded: "images téléchargées",
        uploadButton: "Télécharger"
      },
      buttons: {
        update: "Mettre à jour l'annonce",
        updating: "Mise à jour en cours..."
      },
      categories: {
        analSex: "Sexe anal",
        asianGirls: "Filles asiatiques",
        bbw: "BBW",
        bigTits: "Gros seins",
        blonde: "Blonde",
        brunette: "Brune",
        cim: "CIM",
        ebony: "Ebène",
        eroticMassage: "Massage érotique",
        europeanGirls: "Filles européennes",
        kissing: "Bisous",
        latinaGirls: "Filles latines",
        mature: "Mature",
        vipGirls: "Filles VIP"
      },
      services: {
        analSex: "Sexe anal",
        oralWithoutCondom: "Oral sans préservatif",
        kissing: "Bisous",
        cunnilingus: "Cunnilingus",
        cumInMouth: "Éjaculation dans la bouche (CIM)",
        cumInFace: "Éjaculation sur le visage (CIF)",
        cumOnBody: "Éjaculation sur le corps (COB)",
        eroticMassage: "Massage érotique",
        striptease: "Striptease",
        goldenShower: "Douche dorée"
      },
      contactSections: {
        phone: "Numéro de téléphone",
        messengers: "Réseaux sociaux & Messageries"
      },
      options: {
        years: "ans",
        yes: "Oui",
        no: "Non",
        select: "Sélectionnez"
      },
      currentMedia: {
        description: "Ce sont vos médias actuels. Téléchargez de nouveaux médias ci-dessous pour les ajouter ou les remplacer."
      }
    },
    Blacklist: {
      pageTitle: "Gestion de la Blacklist",
      pageSubtitle: "Gérez les clients que vous souhaitez bloquer",
      description: "Les clients blacklistés ne pourront plus voir votre profil, vous contacter, ou accéder à vos informations.",
      
      access: {
        denied: "Accès refusé",
        escortOnly: "Accès réservé aux escorts",
        permissionError: "Erreur lors de la vérification des permissions",
        goHome: "Retour à l'accueil"
      },
      
      search: {
        title: "Rechercher un client à blacklister",
        placeholder: "Entrez un nom d'utilisateur",
        noResults: "Aucun client trouvé",
        loading: "Recherche en cours..."
      },
      
      blacklisted: {
        title: "Clients blacklistés",
        empty: "Aucun client blacklisté",
        emptySubtitle: "Utilisez la recherche ci-dessus pour blacklister des clients",
        refresh: "Actualiser",
        blacklisted: "Blacklisté",
        since: "Depuis le",
        registeredOn: "Inscrit le",
        unknownUser: "Utilisateur inconnu"
      },
      
      buttons: {
        block: "Bloquer",
        blocking: "Blocage en cours...",
        unblock: "Débloquer",
        unblocking: "Déblocage en cours...",
        confirmUnblock: "Voulez-vous vraiment retirer cet utilisateur de votre blacklist ?",
        search: "Rechercher",
        refresh: "Actualiser"
      },
      
      messages: {
        success: {
          block: "a été ajouté à votre blacklist",
          unblock: "a été retiré de votre blacklist"
        },
        error: {
          alreadyBlacklisted: "Cet utilisateur est déjà blacklisté",
          block: "Erreur lors du blocage de l'utilisateur",
          unblock: "Erreur lors du déblocage de l'utilisateur",
          search: "Erreur lors de la recherche",
          load: "Erreur lors du chargement de la blacklist",
          generic: "Une erreur est survenue"
        }
      },
      
      info: {
        title: "À propos de la blacklist",
        points: {
          p1: "Les clients blacklistés ne verront plus votre profil",
          p2: "Ils ne pourront plus vous contacter via le chat",
          p3: "Vos annonces ne leur seront plus visibles",
          p4: "Vous pouvez débloquer un client à tout moment",
          p5: "Le client n'est pas notifié lorsqu'il est blacklisté"
        }
      },
      
      loading: "Chargement en cours...",
      loadingBlacklist: "Chargement de la blacklist..."
    },
    Messages: {
      pageTitle: "Messages",
      searchPlaceholder: "Rechercher une conversation...",
      
      emptyStates: {
        noConversations: "Aucune conversation",
        noMessages: "Aucun message",
        firstMessage: "Envoyez votre premier message !",
        selectConversation: "Aucune conversation sélectionnée",
        selectPrompt: "Sélectionnez une conversation pour commencer à discuter",
        loginRequired: "Vous devez être connecté pour accéder aux messages"
      },
      
      conversation: {
        online: "En ligne",
        offline: "Hors ligne",
        userTypes: {
          escort: "Escort",
          client: "Client",
          admin: "Admin"
        },
        you: "Vous: ",
        newConversation: "Nouvelle conversation",
        markAsRead: "Marquer comme lu"
      },
      
      dates: {
        today: "Aujourd'hui",
        yesterday: "Hier",
        unknownDate: "Date inconnue",
        unknownTime: "--:--"
      },
      
      messages: {
        inputPlaceholder: "Écrivez votre message...",
        sending: "Envoi en cours...",
        sendError: "Erreur lors de l'envoi du message",
        readError: "Erreur de lecture du message",
        loading: "Chargement des messages...",
        loadingConversations: "Chargement des conversations..."
      },
      
      actions: {
        newConversation: "Nouvelle conversation",
        send: "Envoyer",
        attach: "Joindre un fichier",
        call: "Appeler",
        menu: "Menu",
        back: "Retour"
      },
      
      status: {
        unread: "Non lu",
        read: "Lu",
        sending: "Envoi..."
      },
      
      loading: "Chargement...",
      online: "En ligne",
      offline: "Hors ligne"
    },
  },
  EscortCard: {
    verified: "VÉRIFIÉ",
    online: "En ligne",
    noPhotos: "Aucune photo",
    escortIn: "Escort :",
    age: "Âge",
    bust: "Bonnet",
    height: "Taille",
    weight: "Poids",
    services: "Services",
    yes: "Oui",
    no: "Non",
    years: "ans",
    cm: "cm",
    kg: "kg",
    lbs: "lbs",
    photos: "photos",
    rating: "Note",
    reviews: "avis",
    favorite: "Favori",
    contact: "Contact",
    review: "Review",
    chat: "Chat",
    call: "Appeler",
    message: "Message",
    priceOnRequest: "Sur demande",
    recently: "Récemment",
    verifiedBadge: "VÉRIFIÉ",
    onlineBadge: "En ligne",
    imageCount: "images",
    heightFormat: "cm / ",
    weightFormat: "kg / ",
    escortTitle: "Escort à"
  },
  FavoriteButton: {
    messages: {
      loginRequired: "Vous devez être connecté pour ajouter aux favoris",
      clientOnly: "Seulement les clients peuvent ajouter aux favoris",
      adIdMissing: "ID d'annonce manquant",
      addedToFavorites: "Ajouté aux favoris",
      removedFromFavorites: "Retiré des favoris",
      alreadyInFavorites: "Cette annonce est déjà dans vos favoris",
      genericError: "Une erreur est survenue",
      loginToAdd: "Connectez-vous pour ajouter aux favoris"
    },
    tooltips: {
      addToFavorites: "Ajouter aux favoris",
      removeFromFavorites: "Retirer des favoris"
    },
    loading: "Chargement..."
  },
  GallerySection: {
    defaultTitle: "Galerie",
    photoCount: "photo",
    photosCount: "photos",
    photoNumber: "Photo",
    zoomPhoto: "Photo agrandie",
    close: "Fermer",
    previous: "Photo précédente",
    next: "Photo suivante",
    currentCount: "sur",
    watermark: "Lovira",
    imageAlt: "Image de la galerie",
    zoomIn: "Zoom",
    loading: "Chargement de la galerie...",
    emptyGallery: "Aucune image disponible",
    navigation: {
      previous: "Photo précédente",
      next: "Photo suivante",
      close: "Fermer la galerie"
    },
  },
  Header: {
    logoAlt: "Logo de l'application",
    buttons: {
      language: "Langue",
      changeLanguage: "Changer de langue",
      favorites: "Favoris",
      review: "Avis",
      chat: "Chat",
      messages: "Messages",
      advertise: "Annoncer",
      advertiseFor: "Annoncer pour",
      profile: "Profil",
      login: "Connexion",
      logout: "Déconnexion",
      escortDashboard: "Tableau de bord",
      clientProfile: "Profil client"
    },
    userTypes: {
      escort: "escort",
      client: "client"
    },
    menu: {
      open: "Ouvrir le menu",
      close: "Fermer le menu"
    },
    flags: {
      us: "États-Unis",
      fr: "France"
    }
  },
  ReviewSection: {
    title: "Avis clients",
    form: {
      ratingLabel: "Votre note",
      commentPlaceholder: "Partagez votre expérience...",
      characters: "caractères",
      publish: "Publier l'avis",
      publishing: "Publication...",
      ratingRequired: "La note est requise",
      commentRequired: "Le commentaire est requis",
      commentMinLength: "Le commentaire doit contenir au moins 10 caractères",
      commentMaxLength: "Le commentaire ne doit pas dépasser 500 caractères"
    },
    reviews: {
      loading: "Chargement des avis...",
      empty: "Soyez le premier à laisser un avis !",
      dateFormat: "le",
      citySeparator: "•",
      anonymous: "Anonyme",
      verified: "Vérifié",
      edited: "(modifié)"
    },
    actions: {
      edit: "Modifier",
      delete: "Supprimer",
      save: "Enregistrer",
      cancel: "Annuler",
      confirmDelete: "Supprimer cet avis ?",
      submit: "Soumettre",
      update: "Mettre à jour",
      validate: "Valider"
    },
    messages: {
      success: {
        published: "Avis publié avec succès!",
        updated: "Avis mis à jour",
        deleted: "Avis supprimé"
      },
      error: {
        publish: "Erreur lors de la publication",
        update: "Erreur lors de la mise à jour",
        delete: "Erreur lors de la suppression",
        generic: "Une erreur est survenue",
        fetch: "Erreur chargement avis"
      },
      validation: {
        ratingRequired: "Veuillez sélectionner une note",
        commentRequired: "Veuillez saisir un commentaire"
      }
    },
    stats: {
      averageRating: "Note moyenne",
      totalReviews: "avis",
      fiveStars: "5 étoiles",
      fourStars: "4 étoiles",
      threeStars: "3 étoiles",
      twoStars: "2 étoiles",
      oneStar: "1 étoile"
    },
    stars: {
      oneStar: "1 étoile",
      twoStars: "2 étoiles",
      threeStars: "3 étoiles",
      fourStars: "4 étoiles",
      fiveStars: "5 étoiles"
    }
  },
  Sidebar: {
    logoAlt: "Logo de Lovira",
    user: {
      profileAlt: "Photo de profil",
      email: "Email",
      username: "Nom d'utilisateur",
      balance: "Solde"
    },
    navigation: {
      home: "Accueil",
      settings: "Paramètres",
      paymentsHistory: "Historique des paiements",
      chat: "Chat",
      blacklist: "Liste noire",
      myAdsByCity: "Mes annonces par ville",
      newAdvert: "Nouvelle annonce",
      allAds: "Toutes les annonces",
      viewAll: "Voir tout",
      createFirstAd: "Créez votre première annonce",
      noAdsYet: "Aucune annonce pour le moment",
      getStarted: "Commencez maintenant"
    },
    buttons: {
      signOut: "Déconnexion",
      signingOut: "Déconnexion en cours...",
      close: "Fermer",
      openMenu: "Ouvrir le menu",
      toggleSidebar: "Basculer la barre latérale",
      createAd: "Créer une annonce",
      viewDetails: "Voir les détails"
    },
    ads: {
      city: "Ville",
      adsCount: "annonces",
      ad: "Annonce",
      adNumber: "Annonce #",
      more: "plus",
      unknownCity: "Inconnu",
      allCities: "Toutes les villes",
      adTitle: "Titre de l'annonce",
      noTitle: "Sans titre"
    },
    language: {
      selector: "Sélecteur de langue",
      englishUS: "Anglais (États-Unis)",
      french: "Français",
      currentLanguage: "Langue actuelle"
    },
    topMenu: {
      postAd: "Publier une annonce",
      balance: "Solde",
      blacklist: "Liste noire",
      notifications: "Notifications"
    },
    messages: {
      signOutSuccess: "Utilisateur déconnecté avec succès",
      signOutError: "Une erreur est survenue lors de la déconnexion"
    },
    status: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès"
    },
    PromoBanner: {
      title: "OFFRE SPÉCIALE LIMITÉE",
      message: "Annonces et remontées GRATUITES jusqu'au",
      cta: "Profiter de l'offre",
      date: "Mars 2026"
    }
  },
   CityRankingPage: {
    loadingCity: "Chargement de la ville...",
    header: {
      title: "Classement à",
      description: "Toutes les annonces classées selon l'algorithme de positionnement",
      myAdsButton: "Mes annonces",
      newAdButton: "Nouvelle Annonce"
    },
    filters: {
      searchPlaceholder: "Rechercher une annonce...",
      sortBy: "Trier par :",
      sortOptions: {
        position: "Position",
        created_at: "Date de création",
        boost_time: "Dernier boost"
      },
      cityInfo: "Ville : ",
      displayingAds: "Annonces :",
      refreshButton: "Actualiser"
    },
    algorithmLegend: {
      title: "💡 Comment fonctionne le classement ?",
      boostedAds: "Annonces boostées passent avant les non-boostées",
      recentBoost: "Boost récent = meilleure position (tri par date)",
      noBoost: "Sans boost = tri par date de création (récent d'abord)"
    },
    loadingRankings: "Chargement du classement...",
    emptyState: {
      title: "Aucune annonce trouvée",
      description: "Il n'y a pas encore d'annonces dans .",
      createFirstAdButton: "Créer la première annonce"
    },
    adCard: {
      // positionBadge: "#{{position}}/{{total}}",
      boostedBadge: "BOOSTÉE",
      userAdBadge: "Votre annonce",
      untitledAd: "Sans titre",
      createdOn: "Créée le",
      boostedAgo: "Boostée",
      viewDetails: "Voir détails",
      alreadyBoosted: "Déjà boostée",
      boostAd: "Booster cette annonce",
      editAd: "Modifier",
      noImageAlt: "Annonce"
    },
    pagination: {
      previous: "Précédent",
      next: "Suivant"
    },
    algorithmDetails: {
      title: "📊 Algorithme de classement détaillé",
      priority1: {
        title: "Priorité 1 : Annonces boostées",
        description: "Les annonces qui ont été boostées récemment sont affichées en premier. Plus le boost est récent, plus l'annonce est haute dans le classement."
      },
      priority2: {
        title: "Priorité 2 : Date de création",
        description: "Pour les annonces non boostées, le classement se fait par date de création. Les annonces les plus récentes apparaissent en premier."
      },
      boostInfo: {
        title: "Comment booster votre annonce ?",
        description: "Cliquez sur l'icône de boost pour booster votre annonce. Le boost dure 24h et place temporairement votre annonce en tête du classement."
      }
    },
    loading: {
      spinner: "Chargement",
      refreshing: "Actualisation"
    }
  }

} 