export default {
    HomePage: {
    hero: {
      title: "Encuentra las mejores escorts en ",
      subtitle: "Plataforma confiable con más de 1,765,491 reseñas verificadas"
    },
    search: {
      title: "Buscar una escort",
      city: {
        label: "Ciudad",
        placeholder: "Seleccionar una ciudad",
        filterPlaceholder: "Filtrar ciudades...",
        noResults: "No se encontraron ciudades para \"{search}\"",
        recent: "RECIENTES",
        seeAllCities: "Ver todas las ciudades →",
        popularBadge: "Ciudad popular",
        availableBadge: "Disponible"
      },
      language: {
        label: "🌍 Idioma",
        placeholder: "Elegir el idioma"
      },
      searchButton: {
        withCity: "BUSCAR EN {city}",
        withoutCity: "SELECCIONA UNA CIUDAD"
      },
      trustBadges: {
        secure: "Verificación segura",
        reviews: "Reseñas auténticas"
      }
    },
    categories: {
      title: "Categorías populares",
      list: {
        vip: "Escort VIP",
        companion: "Compañía",
        massage: "Masaje",
        outcall: "Outcall",
        incall: "Incall",
        new: "Nuevas escorts",
        verified: "Perfiles verificados",
        independent: "Independientes",
        agencies: "Agencias",
        duo: "Dúo/Trio"
      }
    },
    popularCities: {
      title: "Ciudades populares",
      stats: {
        frenchCities: "Ciudades en Francia",
        popularCities: "Ciudades populares"
      },
      exploreAll: "Explorar todas las ciudades"
    },
    recentSearches: {
      title: "Búsquedas recientes"
    },
    featuredEscorts: {
      title: "Escorts destacadas",
      viewAll: "Ver todas",
      loading: "Cargando...",
      empty: {
        title: "No hay escorts disponibles",
        description: "Los anuncios estarán disponibles pronto"
      }
    },
    regions: {
      title: "Descubre por región",
      citiesCount: "ciudades",
      seeCity: "Ver {city} →",
      list: {
        ileDeFrance: "Isla de Francia",
        paca: "Provenza-Alpes-Costa Azul",
        auvergneRhoneAlpes: "Auvernia-Ródano-Alpes",
        occitanie: "Occitania",
        nouvelleAquitaine: "Nueva Aquitania",
        hautsDeFrance: "Altos de Francia"
      }
    },
    stats: {
      verifiedReviews: "Reseñas verificadas",
      citiesCovered: "Ciudades cubiertas",
      customerSupport: "Soporte al cliente",
      verifiedAds: "Anuncios verificados"
    },
    footer: {
      terms: "Al usar este sitio, aceptas nuestros",
      copyright: "© 2025 Lovira - Todos los derechos reservados. Servicio para adultos (+18 años).",
      termsLink: "términos de uso",
      privacyLink: "política de privacidad"
    },
  ClientProfile: {
    Chat: {
      title: "Mensajes",
      conversations: {
        searchPlaceholder: "Buscar una conversación...",
        noConversations: "Sin conversaciones",
        noConversationsDescription: "Inicia una nueva conversación para chatear",
        newConversation: "Nueva conversación",
        youPrefix: "Tú: ",
        unreadCount: "{count, plural, one {# mensaje no leído} other {# mensajes no leídos}}",
        today: "Hoy",
        yesterday: "Ayer",
        unknownDate: "Fecha desconocida",
        online: "En línea",
        offline: "Desconectado",
        viewConversations: "Ver conversaciones"
      },
      chat: {
        noConversationSelected: "Ninguna conversación seleccionada",
        noConversationSelectedDescription: "Selecciona una conversación para empezar a chatear",
        noMessages: "Sin mensajes",
        firstMessagePrompt: "¡Envía tu primer mensaje!",
        openingConversation: "Abriendo conversación...",
        pleaseWait: "Por favor espera",
        typingPlaceholder: "Escribe tu mensaje...",
        sendButton: "Enviar",
        sending: "Enviando..."
      },
      userTypes: {
        escort: "Escort",
        client: "Cliente",
        admin: "Administrador"
      },
      errors: {
        notAuthenticated: "Debes iniciar sesión para acceder a los mensajes",
        clientsOnly: "Solo los clientes pueden contactar escorts",
        escortNotFound: "Escort no encontrada",
        conversationExists: "La conversación ya existe",
        sendMessageError: "Error al enviar el mensaje",
        loadError: "Error al cargar",
        markReadError: "Error al marcar como leído"
      },
      loading: {
        conversations: "Cargando conversaciones...",
        messages: "Cargando mensajes..."
      }
    }
  }
  },
  Auth: {
    SignIn: {
      title: "Bienvenido/a",
      subtitle: "Inicia sesión para acceder a tu cuenta",
      form: {
        email: {
          label: "Dirección de email",
          placeholder: "tu.email@ejemplo.com",
          errors: {
            required: "El email es obligatorio",
            invalid: "Por favor introduce una dirección de email válida"
          }
        },
        password: {
          label: "Contraseña",
          placeholder: "Introduce tu contraseña",
          errors: {
            required: "La contraseña es obligatoria"
          },
          show: "Mostrar contraseña",
          hide: "Ocultar contraseña"
        },
        forgotPassword: "¿Olvidaste tu contraseña?",
        submit: {
          text: "Iniciar sesión",
          loading: "Iniciando sesión..."
        }
      },
      register: {
        noAccount: "¿No tienes una cuenta?",
        orRegisterAs: "O regístrate como:",
        user: "Usuario",
        escort: "Escort"
      },
      features: {
        title: "Características:",
        secureAuth: "Autenticación segura",
        personalizedDashboard: "Panel personalizado",
        easyAccountManagement: "Gestión simplificada de cuenta"
      },
      messages: {
        success: "¡Inicio de sesión exitoso! ¡Bienvenido/a!",
        error: "Error en el inicio de sesión: {error}",
        genericError: "Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo."
      }
    },
    EscortRegistration: {
      title: "Crear cuenta de escort",
      subtitle: "Únete a nuestra plataforma profesional",
      fields: {
        username: "Nombre de usuario",
        email: "Dirección de email",
        password: "Contraseña",
        confirmPassword: "Confirmar contraseña",
        required: "Obligatorio"
      },
      placeholders: {
        username: "Elige un nombre de usuario",
        email: "tu.email@ejemplo.com",
        password: "Crea una contraseña segura",
        confirmPassword: "Vuelve a escribir tu contraseña"
      },
      buttons: {
        createAccount: "Crear cuenta de escort",
        creatingAccount: "Creando cuenta...",
        showPassword: "Mostrar contraseña",
        hidePassword: "Ocultar contraseña",
        signIn: "Iniciar sesión aquí",
        switchToLogin: "Inicia sesión en tu cuenta"
      },
      messages: {
        loginPrompt: "¿Ya tienes una cuenta?",
        agreeTerms: "Al registrarte, aceptas nuestros Términos de uso y nuestra Política de privacidad",
        success: "¡Cuenta de escort creada con éxito! 🎉",
        successDescription: "¡Bienvenido/a a nuestra plataforma!",
        emailVerificationSent: "¡Cuenta creada con éxito! 🎉",
        emailVerificationDescription: "Por favor verifica tu email para confirmar tu cuenta.",
        registrationFailed: "Error en el registro",
        genericError: "Ocurrió un error durante el registro. Por favor, inténtalo de nuevo."
      },
      errors: {
        usernameRequired: "El nombre de usuario es obligatorio",
        usernameTooShort: "El nombre de usuario debe tener al menos 3 caracteres",
        emailRequired: "El email es obligatorio",
        emailInvalid: "Por favor introduce una dirección de email válida",
        passwordRequired: "La contraseña es obligatoria",
        passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
        confirmPasswordRequired: "Por favor confirma tu contraseña",
        passwordsMismatch: "Las contraseñas no coinciden"
      },
      benefits: {
        title: "Beneficios para escorts",
        quickSetup: {
          title: "Configuración rápida",
          description: "Comienza en minutos con nuestro proceso de registro simple."
        },
        unlimitedAds: {
          title: "Anuncios ilimitados",
          description: "Publica tantos anuncios como necesites para tus servicios."
        },
        largeClientBase: {
          title: "Amplia base de clientes",
          description: "Accede a miles de clientes verificados buscando servicios."
        }
      }
    },
  },
  EscortRegistration: {
    pageTitle: "Crear cuenta de Escort",
    pageSubtitle: "Únete a nuestra plataforma profesional",
    
    form: {
      username: {
        label: "Nombre de usuario",
        placeholder: "Elige un nombre de usuario",
        required: "El nombre de usuario es obligatorio",
        minLength: "El nombre de usuario debe tener al menos 3 caracteres"
      },
      email: {
        label: "Dirección de email",
        placeholder: "tu.email@ejemplo.com",
        required: "El email es obligatorio",
        invalid: "Por favor introduce una dirección de email válida"
      },
      password: {
        label: "Contraseña",
        placeholder: "Crea una contraseña segura",
        required: "La contraseña es obligatoria",
        minLength: "La contraseña debe tener al menos 6 caracteres"
      },
      confirmPassword: {
        label: "Confirmar contraseña",
        placeholder: "Vuelve a escribir tu contraseña",
        required: "Por favor confirma tu contraseña",
        noMatch: "Las contraseñas no coinciden"
      },
      requiredField: "*"
    },
    
    buttons: {
      submit: "Crear cuenta de Escort",
      submitting: "Creando cuenta...",
      signIn: "Iniciar sesión aquí"
    },
    
    messages: {
      accountCreated: "¡Cuenta creada con éxito! 🎉",
      verifyEmail: "Por favor verifica tu email para activar tu cuenta.",
      welcome: "¡Bienvenido/a a nuestra plataforma!",
      registrationFailed: "Error en el registro",
      errorOccurred: "Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.",
      alreadyHaveAccount: "¿Ya tienes una cuenta?"
    },
    
    benefits: {
      title: "Beneficios para Escorts",
      quickSetup: {
        title: "Configuración rápida",
        description: "Comienza en minutos con nuestro proceso de registro simple."
      },
      unlimitedAds: {
        title: "Anuncios ilimitados",
        description: "Publica tantos anuncios como desees para tus servicios."
      },
      largeClientBase: {
        title: "Amplia base de clientes",
        description: "Accede a miles de clientes verificados buscando servicios."
      }
    }
  },
  ClientRegistration: {
    form: {
      username: {
        label: "Tu nombre o apodo",
        placeholder: "Elige un nombre de usuario",
        required: "El nombre de usuario es obligatorio",
        minLength: "El nombre de usuario debe tener al menos 3 caracteres"
      },
      email: {
        label: "Dirección de email",
        placeholder: "tu.email@ejemplo.com",
        required: "El email es obligatorio",
        invalid: "Por favor introduce una dirección de email válida"
      },
      password: {
        label: "Contraseña",
        placeholder: "Crea una contraseña segura",
        required: "La contraseña es obligatoria",
        minLength: "La contraseña debe tener al menos 6 caracteres"
      },
      confirmPassword: {
        label: "Confirmar contraseña",
        placeholder: "Vuelve a escribir tu contraseña",
        required: "Por favor confirma tu contraseña",
        noMatch: "Las contraseñas no coinciden"
      },
      requiredField: "*"
    },
    
    buttons: {
      submit: "Crear mi cuenta",
      submitting: "Creando cuenta...",
      signIn: "Iniciar sesión aquí"
    },
    
    messages: {
      accountCreated: "¡Cuenta creada con éxito! 🎉",
      userAccountCreated: "¡Cuenta de cliente creada con éxito! 🎉",
      verifyEmail: "Por favor verifica tu email para activar tu cuenta.",
      welcome: "¡Bienvenido/a a nuestra plataforma!",
      registrationFailed: "Error en el registro",
      errorOccurred: "Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.",
      alreadyHaveAccount: "¿Ya tienes una cuenta?"
    },
    
    benefits: {
      title: "Beneficios para los Clientes",
      freeChat: {
        title: "Chat privado gratuito",
        description: "Comunícate directamente con los proveedores de servicios en un entorno seguro."
      },
      verifiedProfiles: {
        title: "Perfiles verificados",
        description: "Explora proveedores de servicios verificados y confiables."
      },
      securePlatform: {
        title: "Plataforma segura",
        description: "Tu privacidad y seguridad son nuestra máxima prioridad."
      }
    }
  },
  Profile: {
    Favorites: {
      // Encabezado
      title: "Mis Favoritos",
      subtitle: "{{count}} escort en tus favoritos",
      subtitle_plural: "{{count}} escorts en tus favoritos",
      
      // Acciones principales
      actions: {
        refresh: "Actualizar",
        refreshing: "Actualizando...",
        allCities: "Todas las ciudades",
        removeAll: "Eliminar todos los favoritos",
        removeAllConfirm: "¿Estás seguro de querer eliminar todos tus favoritos?",
        backToAds: "← Volver a los anuncios",
        removeFromFavorites: "Quitar de favoritos"
      },
      
      // Estadísticas
      stats: {
        totalFavorites: "Total favoritos",
        cities: "Ciudades",
        maxPhotos: "Fotos máx",
        lastAdded: "Último añadido",
        noDate: "Ninguno"
      },
      
      // Estados vacíos
      empty: {
        noFavorites: "Sin favoritos",
        noFavoritesDescription: "Añade escorts a tus favoritos haciendo clic en el icono del corazón en los anuncios",
        noFavoritesInCity: "Sin favoritos en esta ciudad",
        noFavoritesInCityDescription: "No se encontraron favoritos para la ciudad seleccionada",
        browseAds: "Explorar anuncios"
      },
      
      // Filtros
      filters: {
        filterLabel: "Filtro:",
        adCount: "{{count}} anuncio",
        adCount_plural: "{{count}} anuncios",
        clearFilter: "Limpiar filtro"
      },
      
      // Tarjeta de anuncio
      card: {
        unknownCity: "Desconocida",
        noName: "Escort Sin Nombre",
        noDescription: "Sin descripción disponible",
        photosCount: "{{count}} foto",
        photosCount_plural: "{{count}} fotos",
        rateNotSpecified: "Tarifa no especificada",
        ratePerHour: "€{{rate}}/h",
        viewAd: "Ver anuncio",
        viewCity: "Ver ciudad",
        addedOn: "Añadido el",
        addedAt: "a las"
      },
      
      // Consejos de organización
      tips: {
        title: "Consejos de organización",
        sortTitle: "Ordena tus favoritos",
        sortByCity: "Por ciudad para encontrar rápidamente",
        sortByDate: "Por fecha de añadido (los más recientes primero)",
        sortByRate: "Por tarifa para respetar tu presupuesto",
        quickActionsTitle: "Acciones rápidas",
        removeAction: "Haz clic en el icono del corazón para quitar un favorito",
        filterAction: "Usa el filtro por ciudad para organizar mejor",
        noteAction: "Toma notas en los anuncios para encontrarlos más fácilmente"
      },
      
      // Carga y errores
      loading: {
        redirecting: "Redirigiendo a la página de inicio de sesión...",
        loadingFavorites: "Cargando tus favoritos..."
      }
    },
    Settings: {
        title: "Configuración del perfil",
        subtitle: "Gestiona tu información personal",
        email: "Email",
        emailHelper: "Se enviará un email de confirmación si cambias tu dirección",
        username: "Nombre de usuario",
        changePassword: "Cambiar contraseña",
        newPassword: "Nueva contraseña",
        newPasswordPlaceholder: "Mínimo 6 caracteres",
        currentPassword: "Contraseña actual",
        currentPasswordPlaceholder: "Requerida para cambiar la contraseña",
        save: "Guardar",
        saving: "Guardando...",
        contactAdmin: "Contactar al administrador",
        deleteAccount: "¿Eliminar cuenta?",
        deleteAccountMessage: "Por favor envía un mensaje a {email} para solicitar la eliminación de la cuenta",
        goHome: "Inicio",
        backToHome: "Volver al inicio",
        saveChanges: "Guardar cambios",
        messages: {
          loginRequired: "Debes iniciar sesión",
          usernameRequired: "El nombre de usuario es obligatorio",
          currentPasswordRequired: "Debes proporcionar tu contraseña actual para establecer una nueva",
          passwordLength: "La nueva contraseña debe tener al menos 6 caracteres",
          currentPasswordIncorrect: "Contraseña actual incorrecta",
          updateSuccess: "Perfil actualizado con éxito",
          updateError: "Error al actualizar el perfil",
          emailConfirmationSent: "Se ha enviado un email de confirmación a tu nueva dirección"
        }
    },
      Chat: {
      title: "Mensajes",
      
      errors: {
        notAuthenticated: "Debes iniciar sesión para acceder a esta página",
        clientsOnly: "Solo los clientes pueden iniciar conversaciones",
        escortNotFound: "Escort no encontrada",
        conversationExists: "Ya existe una conversación",
        loadError: "Error al cargar",
        sendMessageError: "Error al enviar el mensaje",
        markReadError: "Error al marcar como leído"
      },
      
      conversations: {
        today: "Hoy",
        yesterday: "Ayer",
        unknownDate: "Fecha desconocida",
        viewConversations: "Ver conversaciones",
        searchPlaceholder: "Buscar una conversación...",
        noConversations: "Sin conversaciones",
        noConversationsDescription: "Inicia una nueva conversación con un proveedor",
        newConversation: "Nueva conversación",
        youPrefix: "Tú: ",
        unreadCount: "{{count}} nuevo",
        unreadCount_plural: "{{count}} nuevos",
        online: "En línea",
        offline: "Desconectado"
      },
      
      loading: {
        conversations: "Cargando conversaciones...",
        messages: "Cargando mensajes..."
      },
      
      chat: {
        openingConversation: "Abriendo conversación...",
        pleaseWait: "Por favor espera",
        noConversationSelected: "Selecciona una conversación",
        noConversationSelectedDescription: "Elige una conversación de la lista para comenzar a chatear",
        noMessages: "Sin mensajes por el momento",
        firstMessagePrompt: "Envía el primer mensaje para iniciar la conversación",
        typingPlaceholder: "Escribe tu mensaje...",
        sending: "Enviando...",
        sendButton: "Enviar mensaje"
      },
      
      userTypes: {
        client: "Cliente",
        escort: "Escort",
        admin: "Admin"
      }
    }
  },
  Escorts: {
    CityPage: {
      // Encabezado
      title: "Escorts en {{city}}",
      subtitle: "{{count}} anuncio verificado • Ordenado por relevancia",
      subtitle_plural: "{{count}} anuncios verificados • Ordenado por relevancia",
      searching: "Buscando anuncios...",
      
      // Estadísticas
      stats: {
        totalAds: "Total anuncios",
        top3: "TOP 3",
        top10: "TOP 10",
        boosted: "Boosteados"
      },
      
      // Leyenda del ranking
      legend: {
        title: "Leyenda del ranking:",
        top1: "TOP 1",
        top2: "TOP 2",
        top3: "TOP 3",
        top10: "TOP 10",
        others: "Otras posiciones"
      },
      
      // Estado vacío
      empty: {
        title: "No se encontraron anuncios",
        description: "Aún no hay escorts registradas en {city}. ¡Sé el primero en crear un anuncio!"
      },
      
      // Información de la tarjeta
      card: {
        position: "Posición {{rank}}/{{total}}",
        boosted: "⬆ Boosteada",
        addedOn: "Añadida el"
      },
      
      // Sección "Acerca de"
      about: {
        title: "Acerca del ranking",
        howRanked: {
          title: "¿Cómo se clasifican los anuncios?",
          recentlyBoosted: "Los anuncios recientemente boosteados suben al principio",
          recentAds: "Los anuncios recientes son favorecidos",
          boostDecay: "El boost disminuye después de 24 horas"
        },
        tips: {
          title: "Consejos para mejorar tu posición",
          useBoost: "Usa la función Remontar para aparecer en TOP 1",
          updateRegularly: "Actualiza regularmente tu anuncio",
          addPhotos: "Añade fotos de calidad"
        }
      },
      
      // Paginación
      pagination: {
        previous: "← Anterior",
        next: "Siguiente →"
      },
      
      // Ciudades cercanas
      nearby: {
        title: "Explora otras ciudades",
        viewAll: "Ver todas las ciudades →"
      },
      load: {
        loadMore: "Ver más",
        showing: "Mostrando",
        of: "de",
        ads: "anuncios"
      }

    },
    ProfilePage: {
      // Encabezado
      verified: "Verificada",
      online: "En línea",
      offline: "Desconectada",
      
      // Estado no encontrado
      notFound: {
        title: "Anuncio no encontrado",
        description: "Este anuncio no existe o ya no está disponible",
        backButton: "← Volver a anuncios de {{city}}"
      },
      
      // Secciones principales
      about: {
        title: "Acerca de",
        noDescription: "No se proporcionó descripción.",
        characteristics: "Características",
        servicesOffered: "Servicios ofrecidos"
      },
      
      // Detalles físicos
      physicalDetails: {
        age: "Edad",
        ageUnit: "años",
        height: "Altura",
        heightUnit: "cm",
        weight: "Peso",
        weightUnit: "kg",
        bust: "Busto"
      },
      
      // Servicios
      services: {
        analSex: "Sexo anal",
        oralWithoutCondom: "Oral sin preservativo",
        kissing: "Besos",
        cunnilingus: "Cunnilingus",
        cumInMouth: "Cum in mouth (CIM)",
        cumInFace: "Cum in face (CIF)",
        cumOnBody: "Cum on body (COB)",
        eroticMassage: "Masaje erótico",
        striptease: "Striptease",
        goldenShower: "Golden shower"
      },
      
      // Contactos
      contacts: {
        title: "Contactos",
        phone: "Teléfono",
        email: "Email",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        instagram: "Instagram"
      },
      
      // Galería
      gallery: {
        title: "Galería de fotos"
      },
      
      // Video
      video: {
        title: "Video de la escort",
        notSupported: "Tu navegador no soporta la reproducción de videos.",
        label: "Video"
      },
      
      // Anuncios similares
      similar: {
        title: "Otras escorts en {{city}}",
        startingFrom: "Desde"
      },
      
      // Sidebar de contacto
      contact: {
        title: "Contactar",
        sendMessage: "Enviar mensaje"
      },
      
      // Tarifas
      rates: {
        title: "Tarifas",
        thirtyMinutes: "30 minutos",
        oneHour: "1 hora",
        twoHours: "2 horas",
        fullNight: "Noche completa"
      },
      
      // Información práctica
      info: {
        title: "Información",
        status: "Estado",
        lastUpdate: "Última actualización",
        backToAds: "← Volver a anuncios"
      }
    },
    CategoryPage: {
    // Breadcrumb
    breadcrumb: {
      categories: "Categorías"
    },
    
    // Encabezado
    header: {
      title: "Escorts {{category}}",
      profiles: "Perfiles",
      cities: "Ciudades",
      topCities: "Top ciudades"
    },
    
    // Filtros
    filters: {
      filterByCity: "Filtrar por ciudad:",
      moreOthers: "+{{count}} otras",
      sortBy: {
        newest: "Novedades",
        priceAsc: "Precio ascendente",
        priceDesc: "Precio descendente",
        popular: "Populares"
      }
    },
    
    // Estado vacío
    empty: {
      title: "No se encontraron anuncios",
      description: "Ninguna escort coincide actualmente con la categoría \"{{category}}\". Vuelve pronto o explora otras categorías.",
      viewAllCategories: "← Ver todas las categorías",
      backHome: "Volver al inicio"
    },
    
    // Paginación
    pagination: {
      previous: "← Anterior",
      next: "Siguiente →"
    },
    
    // Categorías similares
    similar: {
      title: "Categorías similares",
      viewAll: "Ver todas →"
    },
    
    // Sección "Acerca de"
    about: {
      title: "Acerca de las escorts {{category}}",
      description1: "La categoría \"{{category}}\" agrupa escorts que se ajustan específicamente a este criterio. Cada perfil ha sido verificado manualmente para asegurar la coincidencia con la categoría.",
      description2: "Para encontrar exactamente lo que buscas, usa los filtros de ciudad y ordenación disponibles. También puedes combinar esta categoría con otros criterios de búsqueda.",
      verifiedProfiles: "Perfiles verificados",
      activeAds: "{{count}} anuncio activo",
      activeAds_plural: "{{count}} anuncios activos",
      citiesAvailable: "{{count}} ciudad disponible",
      citiesAvailable_plural: "{{count}} ciudades disponibles"
    },
    
    // Consejos
    tips: {
      searchTip: {
        title: "Consejo de búsqueda",
        description: "Combina esta categoría con una ciudad específica para refinar tus resultados."
      },
      verifiedProfiles: {
        title: "Perfiles verificados",
        description: "Todos los anuncios son verificados para garantizar la autenticidad de los perfiles."
      },
      updates: {
        title: "Actualizaciones",
        description: "Se añaden nuevos anuncios diariamente en esta categoría."
      }
    }
    }
  },
  Manage: {
    CityAdsPage: {
      loading: "Cargando anuncios...",
      pageTitle: "Mis anuncios en",
      pageSubtitle: "Gestiona todos tus anuncios en esta ciudad",
      stats: {
        totalAds: "Anuncios totales",
        approved: "Aprobados",
        pending: "Pendientes",
        averagePrice: "Precio promedio",
        approvedRate: "Tasa de aprobación",
        lastUpdated: "Última actualización"
      },
      actions: {
        newAdInCity: "Nuevo anuncio en",
        newAdOtherCity: "Nuevo anuncio en otra ciudad",
        createFirstAd: "Crear un primer anuncio",
        viewAllAds: "Ver todos mis anuncios",
        viewAllCities: "Ver todas las ciudades",
        createAnotherAd: "Crear otro anuncio"
      },
      filters: {
        searchPlaceholder: "Buscar en tus anuncios...",
        status: {
          all: "Todos los estados",
          active: "Solo activos",
          pending: "Solo pendientes"
        },
        sort: {
          recent: "Más recientes",
          price_asc: "Precio: ascendente",
          price_desc: "Precio: descendente"
        }
      },
      emptyState: {
        title: "Ningún anuncio en",
        subtitle: "Crea tu primer anuncio en",
        description: "para comenzar a atraer clientes en esta región."
      },
      adCard: {
        untitled: "Anuncio sin título",
        noDescription: "Sin descripción proporcionada.",
        perHour: "/ hora",
        thirtyMinutes: "30min:",
        photos: "fotos",
        views: "vistas",
        viewDetails: "Ver detalles",
        menu: {
          editAd: "Editar anuncio",
          preview: "Vista previa",
          duplicate: "Duplicar",
          delete: "Eliminar"
        }
      },
      badges: {
        approved: "Aprobado",
        pending: "Pendiente",
        rejected: "Rechazado",
        draft: "Borrador"
      },
      performance: {
        title: "Resumen de rendimiento",
        description: "Gestiona eficazmente tus anuncios para maximizar la visibilidad y las reservas en"
      },
      messages: {
        deleteConfirm: "¿Estás segura de que deseas eliminar este anuncio? Esta acción es irreversible.",
        deleteSuccess: "Anuncio eliminado con éxito",
        deleteError: "Error al eliminar el anuncio",
        duplicateSuccess: "Anuncio duplicado con éxito",
        duplicateError: "Error al duplicar el anuncio",
        notFound: "Anuncio no encontrado"
      },
    },
    CityAdIDPage: {
        notFound: {
          title: "Anuncio no encontrado",
          description: "El anuncio con el ID no existe o no tienes acceso a él.",
          backToAds: "Volver a mis anuncios"
        },
        header: {
          title: "Gestión en",
          position: "Posición",
          total: "de"
        },
        rank: {
          title: "Clasificación actual",
          currentRank: "Clasificación en",
          position: "Posición",
          totalAds: "Total anuncios",
          status: "Estado",
          excellent: "Excelente",
          good: "Bueno",
          toImprove: "A mejorar",
          topOne: "🏆 TOP 1",
          topTwo: "🥈 TOP 2",
          topThree: "🥉 TOP 3",
          topNumber: "TOP"
        },
        loading: "Cargando...",
        error: {
          title: "Error de carga",
          message: "No se pudo calcular la posición."
        },
        lastBoost: {
          title: "Último impulso",
          active: "✓ Activo",
          justNow: "ahora mismo",
          hoursAgo: "hace",
          hourAgo: "hace 1h",
          daysAgo: "hace"
        },
        actions: {
          title: "Acciones",
          editProfile: "Editar el perfil",
          editDescription: "Modificar tu información"
        },
        boost: {
          title: "Impulsar en",
          subtitle: "Pasa a la posición #1 en esta ciudad",
          feature1: "Posición #1 garantizada",
          feature1Desc: "Inmediatamente después del impulso",
          feature2: "Impulso reciente prioritario",
          feature2Desc: "Los más recientes se muestran primero",
          button: "IMPULSAR AHORA",
          buttonRe: "RE-IMPULSAR",
          buttonLoading: "Impulsando...",
          currentPosition: "Posición actual:",
          noAdsFound: "Ningún anuncio encontrado en",
          beFirst: "¡Sé la primera en registrarte!"
        },
        howItWorks: {
          title: "¿Cómo se calcula tu clasificación?",
          step1: "Anuncios impulsados",
          step1Desc: "Primero, ordenados por fecha de impulso (más reciente primero)",
          step2: "Anuncios no impulsados",
          step2Desc: "Luego, ordenados por fecha de creación (más reciente primero)",
          step3: "Prioridad",
          step3Desc: "Impulsados recientes > Impulsados antiguos > No impulsados recientes",
          step4: "Impulso inmediato",
          step4Desc: "Un impulso te coloca automáticamente en la posición #1"
        },
        messages: {
          boostError: "No se pudo encontrar el ID del anuncio",
          boostSuccess: "¡Impulso en exitoso!",
          boostConnectionError: "Error de conexión",
          boostGenericError: "Ha ocurrido un error",
          dateInvalid: "Fecha inválida"
        }
    },
    Create: {
      title: "Crear un anuncio",
      sections: {
        basicInfo: "Información básica",
        location: "Ubicación",
        physicalDetails: "Detalles físicos",
        rates: "Tarifas",
        services: "Servicios",
        contacts: "Contactos",
        description: "Descripción",
        categories: "Categorías",
        media: "Medios"
      },
      fields: {
        adTitle: "Título del anuncio",
        required: "Obligatorio",
        country: "País",
        city: "Ciudad",
        age: "Edad",
        height: "Altura (cm)",
        weight: "Peso (kg)",
        bust: "Pecho",
        currency: "Moneda",
        thirtyMinutes: "Tarifa de 30 min",
        oneHour: "Tarifa de 1 hora",
        twoHours: "Tarifa de 2 horas",
        fullNight: "Tarifa de la noche",
        phoneNumber: "Número de teléfono",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        instagram: "Instagram",
        twitter: "Twitter/X",
        description: "Descripción"
      },
      placeholders: {
        adTitle: "ej: Bella Jasmine - Disponible en París",
        selectCity: "Selecciona una ciudad...",
        searchCity: "Buscar una ciudad...",
        selectAge: "Selecciona una edad",
        selectHeight: "Selecciona tu altura",
        selectWeight: "Selecciona tu peso",
        selectBust: "Selecciona",
        thirtyMinutes: "Tarifa de 30min",
        oneHour: "Tarifa de 1h",
        twoHours: "Tarifa de 2h",
        fullNight: "Tarifa de una noche",
        phoneNumber: "+34 6 12 34 56 78",
        whatsapp: "+34 6 12 34 56 78",
        telegram: "@nombredeusuario",
        instagram: "@nombredeusuario",
        twitter: "@nombredeusuario",
        description: "Describe tus servicios..."
      },
      messages: {
        loginRequired: "Debes iniciar sesión",
        escortOnly: "Solo las escorts pueden crear anuncios",
        cityRequired: "Por favor selecciona al menos una ciudad",
        submitSuccess: "¡Anuncio enviado con éxito!",
        submitError: "Error al enviar el anuncio",
        citiesAvailable: "ciudades disponibles",
        noCitiesFound: "No se encontraron ciudades",
        citySelected: "ciudad seleccionada",
        noCitySelected: "Ninguna ciudad seleccionada",
        uploadImages: "Subir imágenes",
        imagesUploaded: "imágenes subidas",
        uploadVideo: "Subir un vídeo",
        uploadButton: "Subir"
      },
      buttons: {
        publish: "Publicar el anuncio",
        publishing: "Enviando...",
        done: "Terminado",
        clear: "Borrar",
        selectParis: "París",
        selectLyon: "Lyon",
        selectMarseille: "Marsella"
      },
      categories: {
        analSex: "Sexo anal",
        asianGirls: "Chicas asiáticas",
        bbw: "BBW",
        bigTits: "Pechos grandes",
        blonde: "Rubia",
        brunette: "Morena",
        cim: "CIM",
        ebony: "Ébano",
        eroticMassage: "Masaje erótico",
        europeanGirls: "Chicas europeas",
        kissing: "Besos",
        latinaGirls: "Chicas latinas",
        mature: "Madura",
        vipGirls: "Chicas VIP"
      },
      services: {
        analSex: "Sexo anal",
        oralWithoutCondom: "Oral sin preservativo",
        kissing: "Besos",
        cunnilingus: "Cunnilingus",
        cumInMouth: "Eyaculación en la boca (CIM)",
        cumInFace: "Eyaculación en la cara (CIF)",
        cumOnBody: "Eyaculación en el cuerpo (COB)",
        eroticMassage: "Masaje erótico",
        striptease: "Striptease",
        goldenShower: "Lluvia dorada"
      },
      contactSections: {
        phone: "Número de teléfono",
        messengers: "Redes sociales y Mensajería"
      },
      options: {
        years: "años",
        yes: "Sí",
        no: "No",
        select: "Selecciona"
      },
      countries: {
        fr: "Francia 🇫🇷",
        us: "Estados Unidos 🇺🇸",
        uk: "Reino Unido 🇬🇧",
        de: "Alemania 🇩🇪",
        es: "España 🇪🇸",
        it: "Italia 🇮🇹"
      },
      currencies: {
        EUR: "EUR (€)",
        USD: "USD ($)",
        GBP: "GBP (£)"
      }
    },
     Update: {
      loading: "Cargando datos del anuncio...",
      title: "Actualizar tu anuncio",
      sections: {
        basicInfo: "Información básica",
        physicalDetails: "Detalles físicos",
        rates: "Tarifas",
        services: "Servicios",
        contacts: "Contactos",
        description: "Descripción",
        categories: "Categorías",
        media: "Medios"
      },
      fields: {
        adTitle: "Título del anuncio",
        required: "Obligatorio",
        age: "Edad",
        height: "Altura (cm)",
        weight: "Peso (kg)",
        bust: "Pecho",
        currency: "Moneda",
        thirtyMinutes: "Tarifa 30 min",
        oneHour: "Tarifa 1 hora",
        twoHours: "Tarifa 2 horas",
        fullNight: "Tarifa noche completa",
        phoneNumber: "Número de teléfono",
        whatsapp: "WhatsApp",
        telegram: "Telegram",
        instagram: "Instagram",
        twitter: "Twitter/X",
        description: "Descripción"
      },
      placeholders: {
        adTitle: "ej: Bella Jasmine - Disponible en París",
        city: "Introduce tu ciudad",
        selectAge: "Selecciona la edad",
        selectHeight: "Selecciona la altura",
        selectWeight: "Selecciona el peso",
        selectBust: "Selecciona",
        phoneNumber: "+34 6 12 34 56 78",
        whatsapp: "+34 6 12 34 56 78",
        telegram: "@nombredeusuario",
        instagram: "@nombredeusuario",
        twitter: "@nombredeusuario",
        description: "Describe tus servicios..."
      },
      messages: {
        loginRequired: "Debes iniciar sesión para realizar esta acción.",
        adIdMissing: "Falta el ID del anuncio.",
        escortOnly: "Acción reservada únicamente a escorts.",
        cityRequired: "Por favor selecciona una ciudad",
        updateSuccess: "¡Anuncio actualizado con éxito!",
        updateError: "Error al actualizar el anuncio",
        loadError: "Error al cargar los datos del anuncio",
        currentImages: "Imágenes actuales",
        currentVideo: "Vídeo actual",
        uploadNewImages: "Subir nuevas imágenes (máx. 10)",
        uploadVideo: "Subir un vídeo",
        imagesUploaded: "imágenes subidas",
        uploadButton: "Subir"
      },
      buttons: {
        update: "Actualizar el anuncio",
        updating: "Actualizando..."
      },
      categories: {
        analSex: "Sexo anal",
        asianGirls: "Chicas asiáticas",
        bbw: "BBW",
        bigTits: "Pechos grandes",
        blonde: "Rubia",
        brunette: "Morena",
        cim: "CIM",
        ebony: "Ébano",
        eroticMassage: "Masaje erótico",
        europeanGirls: "Chicas europeas",
        kissing: "Besos",
        latinaGirls: "Chicas latinas",
        mature: "Madura",
        vipGirls: "Chicas VIP"
      },
      services: {
        analSex: "Sexo anal",
        oralWithoutCondom: "Oral sin preservativo",
        kissing: "Besos",
        cunnilingus: "Cunnilingus",
        cumInMouth: "Eyaculación en la boca (CIM)",
        cumInFace: "Eyaculación en la cara (CIF)",
        cumOnBody: "Eyaculación en el cuerpo (COB)",
        eroticMassage: "Masaje erótico",
        striptease: "Striptease",
        goldenShower: "Lluvia dorada"
      },
      contactSections: {
        phone: "Número de teléfono",
        messengers: "Redes sociales y Mensajería"
      },
      options: {
        years: "años",
        yes: "Sí",
        no: "No",
        select: "Selecciona"
      },
      currentMedia: {
        description: "Estos son tus medios actuales. Sube nuevos medios a continuación para agregarlos o reemplazarlos."
      }
    },
    Blacklist: {
      pageTitle: "Gestión de la Lista Negra",
      pageSubtitle: "Gestiona los clientes que deseas bloquear",
      description: "Los clientes en lista negra no podrán ver tu perfil, contactarte o acceder a tu información.",
      
      access: {
        denied: "Acceso denegado",
        escortOnly: "Acceso reservado a escorts",
        permissionError: "Error al verificar los permisos",
        goHome: "Volver al inicio"
      },
      
      search: {
        title: "Buscar un cliente para incluir en lista negra",
        placeholder: "Introduce un nombre de usuario",
        noResults: "No se encontró ningún cliente",
        loading: "Buscando..."
      },
      
      blacklisted: {
        title: "Clientes en lista negra",
        empty: "Ningún cliente en lista negra",
        emptySubtitle: "Usa la búsqueda arriba para incluir clientes en lista negra",
        refresh: "Actualizar",
        blacklisted: "En lista negra",
        since: "Desde el",
        registeredOn: "Registrado el",
        unknownUser: "Usuario desconocido"
      },
      
      buttons: {
        block: "Bloquear",
        blocking: "Bloqueando...",
        unblock: "Desbloquear",
        unblocking: "Desbloqueando...",
        confirmUnblock: "¿Realmente deseas eliminar este usuario de tu lista negra?",
        search: "Buscar",
        refresh: "Actualizar"
      },
      
      messages: {
        success: {
          block: "ha sido agregado a tu lista negra",
          unblock: "ha sido eliminado de tu lista negra"
        },
        error: {
          alreadyBlacklisted: "Este usuario ya está en lista negra",
          block: "Error al bloquear al usuario",
          unblock: "Error al desbloquear al usuario",
          search: "Error al buscar",
          load: "Error al cargar la lista negra",
          generic: "Ha ocurrido un error"
        }
      },
      
      info: {
        title: "Acerca de la lista negra",
        points: {
          p1: "Los clientes en lista negra ya no verán tu perfil",
          p2: "No podrán contactarte a través del chat",
          p3: "Tus anuncios ya no les serán visibles",
          p4: "Puedes desbloquear a un cliente en cualquier momento",
          p5: "El cliente no es notificado cuando está en lista negra"
        }
      },
      
      loading: "Cargando...",
      loadingBlacklist: "Cargando lista negra..."
    },
    Messages: {
      pageTitle: "Mensajes",
      searchPlaceholder: "Buscar una conversación...",
      
      emptyStates: {
        noConversations: "Ninguna conversación",
        noMessages: "Ningún mensaje",
        firstMessage: "¡Envía tu primer mensaje!",
        selectConversation: "Ninguna conversación seleccionada",
        selectPrompt: "Selecciona una conversación para comenzar a chatear",
        loginRequired: "Debes iniciar sesión para acceder a los mensajes"
      },
      
      conversation: {
        online: "En línea",
        offline: "Desconectado",
        userTypes: {
          escort: "Escort",
          client: "Cliente",
          admin: "Admin"
        },
        you: "Tú: ",
        newConversation: "Nueva conversación",
        markAsRead: "Marcar como leído"
      },
      
      dates: {
        today: "Hoy",
        yesterday: "Ayer",
        unknownDate: "Fecha desconocida",
        unknownTime: "--:--"
      },
      
      messages: {
        inputPlaceholder: "Escribe tu mensaje...",
        sending: "Enviando...",
        sendError: "Error al enviar el mensaje",
        readError: "Error de lectura del mensaje",
        loading: "Cargando mensajes...",
        loadingConversations: "Cargando conversaciones..."
      },
      
      actions: {
        newConversation: "Nueva conversación",
        send: "Enviar",
        attach: "Adjuntar un archivo",
        call: "Llamar",
        menu: "Menú",
        back: "Volver"
      },
      
      status: {
        unread: "No leído",
        read: "Leído",
        sending: "Enviando..."
      },
      
      loading: "Cargando...",
      online: "En línea",
      offline: "Desconectado"
    },
  },
  EscortCard: {
    verified: "VERIFICADO",
    online: "En línea",
    noPhotos: "Sin fotos",
    escortIn: "Escort:",
    age: "Edad",
    bust: "Pecho",
    height: "Altura",
    weight: "Peso",
    services: "Servicios",
    yes: "Sí",
    no: "No",
    years: "años",
    cm: "cm",
    kg: "kg",
    lbs: "lbs",
    photos: "fotos",
    rating: "Puntuación",
    reviews: "opiniones",
    favorite: "Favorito",
    contact: "Contacto",
    review: "Reseña",
    chat: "Chat",
    call: "Llamar",
    message: "Mensaje",
    priceOnRequest: "Bajo petición",
    recently: "Recientemente",
    verifiedBadge: "VERIFICADO",
    onlineBadge: "En línea",
    imageCount: "imágenes",
    heightFormat: "cm / ",
    weightFormat: "kg / ",
    escortTitle: "Escort en"
  },
  FavoriteButton: {
    messages: {
      loginRequired: "Debes iniciar sesión para agregar a favoritos",
      clientOnly: "Solo los clientes pueden agregar a favoritos",
      adIdMissing: "Falta el ID del anuncio",
      addedToFavorites: "Agregado a favoritos",
      removedFromFavorites: "Eliminado de favoritos",
      alreadyInFavorites: "Este anuncio ya está en tus favoritos",
      genericError: "Ha ocurrido un error",
      loginToAdd: "Inicia sesión para agregar a favoritos"
    },
    tooltips: {
      addToFavorites: "Agregar a favoritos",
      removeFromFavorites: "Eliminar de favoritos"
    },
    loading: "Cargando..."
  },
  GallerySection: {
    defaultTitle: "Galería",
    photoCount: "foto",
    photosCount: "fotos",
    photoNumber: "Foto",
    zoomPhoto: "Foto ampliada",
    close: "Cerrar",
    previous: "Foto anterior",
    next: "Foto siguiente",
    currentCount: "de",
    watermark: "Lovira",
    imageAlt: "Imagen de la galería",
    zoomIn: "Zoom",
    loading: "Cargando galería...",
    emptyGallery: "No hay imágenes disponibles",
    navigation: {
      previous: "Foto anterior",
      next: "Foto siguiente",
      close: "Cerrar la galería"
    },
  },
  Header: {
    logoAlt: "Logo de la aplicación",
    buttons: {
      language: "Idioma",
      changeLanguage: "Cambiar idioma",
      favorites: "Favoritos",
      review: "Opinión",
      chat: "Chat",
      messages: "Mensajes",
      advertise: "Anunciar",
      advertiseFor: "Anunciar para",
      profile: "Perfil",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
      escortDashboard: "Panel de control",
      clientProfile: "Perfil de cliente"
    },
    userTypes: {
      escort: "escort",
      client: "cliente"
    },
    menu: {
      open: "Abrir el menú",
      close: "Cerrar el menú"
    },
    flags: {
      us: "Estados Unidos",
      fr: "Francia"
    }
  },
  ReviewSection: {
    title: "Opiniones de clientes",
    form: {
      ratingLabel: "Tu puntuación",
      commentPlaceholder: "Comparte tu experiencia...",
      characters: "caracteres",
      publish: "Publicar opinión",
      publishing: "Publicando...",
      ratingRequired: "La puntuación es requerida",
      commentRequired: "El comentario es requerido",
      commentMinLength: "El comentario debe contener al menos 10 caracteres",
      commentMaxLength: "El comentario no debe superar los 500 caracteres"
    },
    reviews: {
      loading: "Cargando opiniones...",
      empty: "¡Sé el primero en dejar una opinión!",
      dateFormat: "el",
      citySeparator: "•",
      anonymous: "Anónimo",
      verified: "Verificado",
      edited: "(editado)"
    },
    actions: {
      edit: "Editar",
      delete: "Eliminar",
      save: "Guardar",
      cancel: "Cancelar",
      confirmDelete: "¿Eliminar esta opinión?",
      submit: "Enviar",
      update: "Actualizar",
      validate: "Validar"
    },
    messages: {
      success: {
        published: "¡Opinión publicada con éxito!",
        updated: "Opinión actualizada",
        deleted: "Opinión eliminada"
      },
      error: {
        publish: "Error al publicar",
        update: "Error al actualizar",
        delete: "Error al eliminar",
        generic: "Ha ocurrido un error",
        fetch: "Error al cargar opiniones"
      },
      validation: {
        ratingRequired: "Por favor selecciona una puntuación",
        commentRequired: "Por favor introduce un comentario"
      }
    },
    stats: {
      averageRating: "Puntuación media",
      totalReviews: "opiniones",
      fiveStars: "5 estrellas",
      fourStars: "4 estrellas",
      threeStars: "3 estrellas",
      twoStars: "2 estrellas",
      oneStar: "1 estrella"
    },
    stars: {
      oneStar: "1 estrella",
      twoStars: "2 estrellas",
      threeStars: "3 estrellas",
      fourStars: "4 estrellas",
      fiveStars: "5 estrellas"
    }
  },
  Sidebar: {
    logoAlt: "Logo de Lovira",
    user: {
      profileAlt: "Foto de perfil",
      email: "Email",
      username: "Nombre de usuario",
      balance: "Saldo"
    },
    navigation: {
      home: "Inicio",
      settings: "Configuración",
      paymentsHistory: "Historial de pagos",
      chat: "Chat",
      blacklist: "Lista negra",
      myAdsByCity: "Mis anuncios por ciudad",
      newAdvert: "Nuevo anuncio",
      allAds: "Todos los anuncios",
      viewAll: "Ver todo",
      createFirstAd: "Crea tu primer anuncio",
      noAdsYet: "Ningún anuncio por el momento",
      getStarted: "Comienza ahora"
    },
    buttons: {
      signOut: "Cerrar sesión",
      signingOut: "Cerrando sesión...",
      close: "Cerrar",
      openMenu: "Abrir el menú",
      toggleSidebar: "Alternar barra lateral",
      createAd: "Crear un anuncio",
      viewDetails: "Ver detalles"
    },
    ads: {
      city: "Ciudad",
      adsCount: "anuncios",
      ad: "Anuncio",
      adNumber: "Anuncio #",
      more: "más",
      unknownCity: "Desconocido",
      allCities: "Todas las ciudades",
      adTitle: "Título del anuncio",
      noTitle: "Sin título"
    },
    language: {
      selector: "Selector de idioma",
      englishUS: "Inglés (Estados Unidos)",
      french: "Francés",
      currentLanguage: "Idioma actual"
    },
    topMenu: {
      postAd: "Publicar un anuncio",
      balance: "Saldo",
      blacklist: "Lista negra",
      notifications: "Notificaciones"
    },
    messages: {
      signOutSuccess: "Usuario desconectado con éxito",
      signOutError: "Ha ocurrido un error al cerrar sesión"
    },
    status: {
      loading: "Cargando...",
      error: "Error",
      success: "Éxito"
    },
    PromoBanner: {
      title: "OFERTA ESPECIAL LIMITADA",
      message: "Anuncios y promociones GRATIS hasta el",
      cta: "Aprovechar la oferta",
      date: "Marzo de 2026"
   }
  },
  CityRankingPage: {
    loadingCity: "Cargando ciudad...",
    header: {
      title: "Clasificación en ",
      description: "Todos los anuncios clasificados según el algoritmo de posicionamiento",
      myAdsButton: "Mis anuncios",
      newAdButton: "Nuevo Anuncio"
    },
    filters: {
      searchPlaceholder: "Buscar un anuncio...",
      sortBy: "Ordenar por:",
      sortOptions: {
        position: "Posición",
        created_at: "Fecha de creación",
        boost_time: "Último boost"
      },
      cityInfo: "Ciudad: ",
      displayingAds: "Anuncios ",
      refreshButton: "Actualizar"
    },
    algorithmLegend: {
      title: "💡 ¿Cómo funciona la clasificación?",
      boostedAds: "Los anuncios boosteados aparecen antes que los no boosteados",
      recentBoost: "Boost reciente = mejor posición (ordenado por fecha)",
      noBoost: "Sin boost = ordenado por fecha de creación (reciente primero)"
    },
    loadingRankings: "Cargando clasificación...",
    emptyState: {
      title: "No se encontraron anuncios",
      description: "Todavía no hay anuncios en .",
      createFirstAdButton: "Crear el primer anuncio"
    },
    adCard: {
      // positionBadge: "#{{position}}/{{total}}",
      boostedBadge: "BOOSTEADA",
      userAdBadge: "Tu anuncio",
      untitledAd: "Sin título",
      createdOn: "Creado el ",
      boostedAgo: "Boosteada ",
      viewDetails: "Ver detalles",
      alreadyBoosted: "Ya boosteada",
      boostAd: "Booster este anuncio",
      editAd: "Editar",
      noImageAlt: "Anuncio"
    },
    pagination: {
      previous: "Anterior",
      next: "Siguiente"
    },
    algorithmDetails: {
      title: "📊 Algoritmo de clasificación detallado",
      priority1: {
        title: "Prioridad 1: Anuncios boosteados",
        description: "Los anuncios que han sido boosteados recientemente se muestran primero. Cuanto más reciente sea el boost, más alto estará el anuncio en la clasificación."
      },
      priority2: {
        title: "Prioridad 2: Fecha de creación",
        description: "Para anuncios no boosteados, la clasificación se hace por fecha de creación. Los anuncios más recientes aparecen primero."
      },
      boostInfo: {
        title: "¿Cómo booster tu anuncio?",
        description: "Haz clic en el icono de boost para booster tu anuncio. El boost dura 24h y coloca temporalmente tu anuncio en la cima de la clasificación."
      }
    },
    loading: {
      spinner: "Cargando",
      refreshing: "Actualizando"
    }
  }
} as const