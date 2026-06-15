export type Lang = "tr" | "en" | "es" | "it" | "pt";

export const DEFAULT_LANG: Lang = "en";

export const LANG_STORAGE_KEY = "lang";
export const LANG_COOKIE_NAME = "lang";

export const LANGUAGES: { code: Lang; flag: string; label: string }[] = [
  { code: "tr", flag: "🇹🇷", label: "Türkçe" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "it", flag: "🇮🇹", label: "Italiano" },
  { code: "pt", flag: "🇵🇹", label: "Português" },
];

export function isValidLang(value: string): value is Lang {
  return LANGUAGES.some((l) => l.code === value);
}

export type Translations = {
  landing: {
    subtitle: string;
    tagline: string;
    enter: string;
    footer: string;
  };
  common: {
    back: string;
    home: string;
    saving: string;
    uploading: string;
    somethingWentWrong: string;
    failedToSave: string;
    uploadFailed: string;
  };
  group: {
    subtitle: string;
    emptyProfiles: string;
    viewProfile: string;
    mapLink: string;
    mapTitle: string;
    mapEmpty: string;
    playlist: string;
    playlistEmpty: string;
  };
  profile: {
    favoriteMemory: string;
    noteToAli: string;
    audioMessage: string;
    audioFrom: (name: string) => string;
    audioUnsupported: string;
    photos: string;
    photoBy: (name: string) => string;
    photosPrivate: string;
    home: string;
    loadingPhoto: string;
    privatePhoto: string;
    photoError: string;
    adminToken: string;
    adminTokenPlaceholder: string;
    unlockPhotos: string;
    unlocking: string;
    invalidToken: string;
    nothingYet: (firstName: string) => string;
    isThisYou: string;
    checkEditLink: string;
  };
  edit: {
    accessDenied: string;
    accessDeniedDesc: string;
    viewPublicProfile: string;
    viewProfile: string;
    title: (name: string) => string;
    subtitle: string;
    partOf: string;
    name: string;
    country: string;
    city: string;
    flagEmoji: string;
    countryPlaceholder: string;
    cityPlaceholder: string;
    countryHelper: string;
    cityHelper: string;
    flagPlaceholder: string;
    savedProfile: string;
    saveChanges: string;
    favoriteMemory: string;
    favoriteMemoryDesc: string;
    favoriteMemoryPlaceholder: string;
    saveMemory: string;
    memorySaved: string;
    noteToAli: string;
    noteToAliDesc: string;
    notePlaceholder: string;
    saveNote: string;
    noteSaved: string;
    audioMessage: string;
    audioMessageDesc: string;
    audioReplaceWarning: string;
    startRecording: string;
    stopRecording: string;
    uploadRecording: string;
    discard: string;
    orUploadFile: string;
    audioSaved: string;
    micDenied: string;
    photos: string;
    photosDesc: string;
    photosLabel: string;
    photosSelected: (count: number) => string;
    captionOptional: string;
    captionPlaceholder: string;
    choosePhoto: string;
    photoUploaded: string;
    photosUploaded: string;
    uploadPhotos: string;
    homeCityOnMap: string;
    homeCityDesc: string;
    loadingMap: string;
    clickMapFirst: string;
    locationSaved: string;
    saveLocation: string;
    failedToSaveLocation: string;
    selectCountryFirst: string;
    noResults: string;
    playlistAdd: string;
    playlistDesc: string;
    songName: string;
    songNamePlaceholder: string;
    artist: string;
    artistPlaceholder: string;
    spotifyUrl: string;
    saveSong: string;
    songSaved: string;
    saveAll: string;
    unsavedChanges: string;
    savedAll: string;
  };
  welcome: {
    title: (name: string) => string;
    intro: string;
    privacy: string;
    lead: string;
    items: string[];
    optional: string;
    skip: string;
    button: string;
  };
  join: {
    greeting: string;
    namePlaceholder: string;
    submit: string;
    continue: string;
    joining: string;
  };
  enter: {
    title: string;
    subtitle: string;
    passwordPlaceholder: string;
    submit: string;
    entering: string;
    wrongPassword: string;
  };
  error: {
    title: string;
    subtitle: string;
    retry: string;
  };
  notFound: {
    title: string;
    subtitle: string;
    home: string;
  };
};

export const translations: Record<Lang, Translations> = {
  tr: {
    landing: {
      subtitle: "ERASMUS • UCLM • 2025–26",
      tagline: "Geçti ama bitmedi.",
      enter: "→ Gir",
      footer: "UCLM · Fakülte · Ciudad Real",
    },
    common: {
      back: "Geri",
      home: "Ana Sayfa",
      saving: "Kaydediliyor…",
      uploading: "Yükleniyor…",
      somethingWentWrong: "Bir şeyler ters gitti",
      failedToSave: "Kaydedilemedi",
      uploadFailed: "Yükleme başarısız",
    },
    group: {
      subtitle: "Orada olan herkes — şimdi neredeler.",
      emptyProfiles:
        "Henüz profil yok. Başlamak için arkadaşlarınla düzenleme linklerini paylaş.",
      viewProfile: "Gör →",
      mapLink: "🗺️ Harita",
      mapTitle: "Harita",
      mapEmpty: "Henüz kimse konumunu eklemedi.",
      playlist: "🎵 Playlist",
      playlistEmpty: "Henüz şarkı eklenmedi.",
    },
    profile: {
      favoriteMemory: "Favori an",
      noteToAli: "Ali'ye not",
      audioMessage: "Sesli mesaj",
      audioFrom: (name) => `${name} adlı kişiden sesli mesaj`,
      audioUnsupported: "Tarayıcınız ses oynatmayı desteklemiyor.",
      photos: "Fotoğraflar",
      photoBy: (name) => `${name} tarafından fotoğraf`,
      photosPrivate:
        "Fotoğraflar gizli. Görmek için admin token'ını gir.",
      home: "Ev",
      loadingPhoto: "Yükleniyor…",
      privatePhoto: "Gizli fotoğraf — admin erişimi gerekli",
      photoError: "Fotoğraf yüklenemedi",
      adminToken: "Admin token",
      adminTokenPlaceholder: "ADMIN_TOKEN'ını yapıştır",
      unlockPhotos: "Fotoğrafları aç",
      unlocking: "Açılıyor…",
      invalidToken: "Geçersiz token",
      nothingYet: (firstName) =>
        `Henüz bir şey yok — ${firstName} anılarını eklediğinde tekrar bak.`,
      isThisYou: "Bu sen misin?",
      checkEditLink: "Profilini güncellemek için kişisel düzenleme linkini kontrol et.",
    },
    edit: {
      accessDenied: "Erişim reddedildi",
      accessDeniedDesc:
        "Bu düzenleme linki geçersiz veya süresi dolmuş. Kişisel düzenleme linkin sadece sana ait — arkadaşının paylaştığı URL'yi kontrol et.",
      viewPublicProfile: "← Herkese açık profili gör",
      viewProfile: "Profili gör",
      title: (name) => `Düzenle — ${name}`,
      subtitle: "Anılarını paylaş. Bu sayfayı sadece sen görebilirsin.",
      partOf: "Grup:",
      name: "İsim",
      country: "Ülke",
      city: "Şehir",
      flagEmoji: "Bayrak emojisi",
      countryPlaceholder: "Ülke seç…",
      cityPlaceholder: "Şehir seç…",
      countryHelper: "Listeden seç veya yaz",
      cityHelper: "Ülke seçtikten sonra aktif olur",
      flagPlaceholder: "🇪🇸",
      savedProfile: "Kaydedildi — profilin güncellendi.",
      saveChanges: "Değişiklikleri kaydet",
      favoriteMemory: "Favori an",
      favoriteMemoryDesc:
        "Erasmus'tan hatırlamak istediğin bir an — sadece ben okuyacağım.",
      favoriteMemoryPlaceholder: "O gece çatı katında…",
      saveMemory: "Anıyı kaydet",
      memorySaved: "Anı kaydedildi.",
      noteToAli: "Ali'ye not",
      noteToAliDesc: "Özel bir not — sadece Ali okuyacak.",
      notePlaceholder: "Sevgili Ali…",
      saveNote: "Notu kaydet",
      noteSaved: "Not kaydedildi.",
      audioMessage: "Sesli mesaj",
      audioMessageDesc:
        "Sesli mesaj kaydet veya ses dosyası yükle. Sadece Ali dinleyebilir.",
      audioReplaceWarning:
        "Zaten bir sesli mesajın var. Kaydetmek veya yüklemek onu değiştirecek.",
      startRecording: "Kayda başla",
      stopRecording: "Kaydı durdur",
      uploadRecording: "Kaydı yükle",
      discard: "Vazgeç",
      orUploadFile: "Veya dosya yükle",
      audioSaved: "Sesli mesaj kaydedildi.",
      micDenied: "Mikrofon erişimi reddedildi veya kullanılamıyor.",
      photos: "Fotoğraflar",
      photosDesc:
        "Bir veya daha fazla fotoğraf yükle. Gizli saklanırlar — görmek için admin erişimi gerekir.",
      photosLabel: "Fotoğraflar",
      photosSelected: (count) => `${count} fotoğraf seçildi`,
      captionOptional: "İlk fotoğraf için açıklama (isteğe bağlı)",
      captionPlaceholder: "Bu an hakkında bir not…",
      choosePhoto: "En az bir fotoğraf seç",
      photoUploaded: "Fotoğraf yüklendi.",
      photosUploaded: "Fotoğraflar yüklendi.",
      uploadPhotos: "Fotoğrafları yükle",
      homeCityOnMap: "Haritada yaşadığın şehir",
      homeCityDesc: "Şu an yaşadığın yere bir pin koymak için haritaya tıkla.",
      loadingMap: "Harita yükleniyor…",
      clickMapFirst: "Önce haritaya tıklayarak pinini yerleştir.",
      locationSaved: "Konum kaydedildi.",
      saveLocation: "Konumu kaydet",
      failedToSaveLocation: "Konum kaydedilemedi",
      selectCountryFirst: "Önce bir ülke seç",
      noResults: "Sonuç bulunamadı",
      playlistAdd: "Playlist'e ekle",
      playlistDesc: "Erasmus'tan bir şarkı bırak — grup sayfasında listelenecek.",
      songName: "Şarkı adı",
      songNamePlaceholder: "Şarkı adı…",
      artist: "Sanatçı",
      artistPlaceholder: "Sanatçı…",
      spotifyUrl: "Spotify linki (isteğe bağlı)",
      saveSong: "Ekle",
      songSaved: "Şarkı eklendi.",
      saveAll: "Kaydet",
      unsavedChanges: "Kaydedilmedi",
      savedAll: "✓ Kaydedildi",
    },
    welcome: {
      title: (name) => `Hoş geldin, ${name}! 👋`,
      intro: "Bu sayfa sadece sana ait — linkini kimseyle paylaşma.",
      privacy: "Sadece sen bu sayfayı açabilirsin — başka kimse göremez.",
      lead: "Burada birkaç şey bırakabilirsin:",
      items: [
        "✍️ Favori anın — sadece ben okuyacağım",
        "💌 Ali'ye özel bir not — sadece ben okuyacağım",
        "🎙️ Sesli mesaj — sadece ben dinleyeceğim",
        "📸 Fotoğraflar — sadece ben göreceğim",
        "📍 Şehrin — haritada görünecek",
      ],
      optional: "Hepsini doldurmak zorunda değilsin.",
      skip: "İstediğini bırak, istediğini boş bırak.",
      button: "Tamam, başlayalım →",
    },
    join: {
      greeting: "Hoş geldin.",
      namePlaceholder: "Adın...",
      submit: "→ Katıl",
      continue: "→ Devam et",
      joining: "Katılıyor…",
    },
    enter: {
      title: "Giriş",
      subtitle: "Albümü görmek için şifreyi gir.",
      passwordPlaceholder: "Şifre…",
      submit: "→ Gir",
      entering: "Giriliyor…",
      wrongPassword: "Yanlış şifre",
    },
    error: {
      title: "Bir şeyler ters gitti.",
      subtitle: "Ama anılar hâlâ burada.",
      retry: "← Geri dön",
    },
    notFound: {
      title: "Bu sayfa yok.",
      subtitle: "Belki de zaten geçmişte kaldı.",
      home: "Ana sayfaya dön →",
    },
  },
  en: {
    landing: {
      subtitle: "ERASMUS • UCLM • 2025–26",
      tagline: "It ended. But not really.",
      enter: "→ Enter",
      footer: "UCLM · Faculty of Letters · Ciudad Real",
    },
    common: {
      back: "Back",
      home: "Home",
      saving: "Saving…",
      uploading: "Uploading…",
      somethingWentWrong: "Something went wrong",
      failedToSave: "Failed to save",
      uploadFailed: "Upload failed",
    },
    group: {
      subtitle: "Everyone who was there — and where they are now.",
      emptyProfiles:
        "No profiles yet. Share edit links with your friends to get started.",
      viewProfile: "View →",
      mapLink: "🗺️ Map",
      mapTitle: "Map",
      mapEmpty: "No one has added their location yet.",
      playlist: "🎵 Playlist",
      playlistEmpty: "No songs added yet.",
    },
    profile: {
      favoriteMemory: "Favorite memory",
      noteToAli: "Note to Ali",
      audioMessage: "Audio message",
      audioFrom: (name) => `Audio message from ${name}`,
      audioUnsupported: "Your browser does not support audio playback.",
      photos: "Photos",
      photoBy: (name) => `Photo by ${name}`,
      photosPrivate: "Photos are private. Enter your admin token to view them.",
      home: "Home",
      loadingPhoto: "Loading…",
      privatePhoto: "Private photo — admin access required",
      photoError: "Could not load photo",
      adminToken: "Admin token",
      adminTokenPlaceholder: "Paste your ADMIN_TOKEN",
      unlockPhotos: "Unlock photos",
      unlocking: "Unlocking…",
      invalidToken: "Invalid token",
      nothingYet: (firstName) =>
        `Nothing here yet — check back once ${firstName} adds their memories.`,
      isThisYou: "Is this you?",
      checkEditLink: "Check your personal edit link to update your profile.",
    },
    edit: {
      accessDenied: "Access denied",
      accessDeniedDesc:
        "This edit link is invalid or expired. Only you should have your personal edit link — check the URL your friend shared with you.",
      viewPublicProfile: "← View public profile",
      viewProfile: "View profile",
      title: (name) => `Edit — ${name}`,
      subtitle: "Share your memories. Only you can see this page.",
      partOf: "Part of",
      name: "Name",
      country: "Country",
      city: "City",
      flagEmoji: "Flag emoji",
      countryPlaceholder: "Select country…",
      cityPlaceholder: "Select city…",
      countryHelper: "Select from list or type",
      cityHelper: "Available after selecting country",
      flagPlaceholder: "🇪🇸",
      savedProfile: "Saved — your profile has been updated.",
      saveChanges: "Save changes",
      favoriteMemory: "Favorite memory",
      favoriteMemoryDesc:
        "A moment from Erasmus you want to remember — only I will read it.",
      favoriteMemoryPlaceholder: "That night on the rooftop when…",
      saveMemory: "Save memory",
      memorySaved: "Memory saved.",
      noteToAli: "Note to Ali",
      noteToAliDesc: "A private note — only Ali will read this.",
      notePlaceholder: "Dear Ali…",
      saveNote: "Save note",
      noteSaved: "Note saved.",
      audioMessage: "Audio message",
      audioMessageDesc:
        "Record a voice message or upload an audio file. Only Ali can listen.",
      audioReplaceWarning:
        "You already have an audio message. Recording or uploading will replace it.",
      startRecording: "Start recording",
      stopRecording: "Stop recording",
      uploadRecording: "Upload recording",
      discard: "Discard",
      orUploadFile: "Or upload a file",
      audioSaved: "Audio message saved.",
      micDenied: "Microphone access denied or unavailable.",
      photos: "Photos",
      photosDesc:
        "Upload one or more photos. They are stored privately — viewers need admin access to see them.",
      photosLabel: "Photos",
      photosSelected: (count) =>
        `${count} photo${count !== 1 ? "s" : ""} selected`,
      captionOptional: "Caption for first photo (optional)",
      captionPlaceholder: "A note about this moment…",
      choosePhoto: "Choose at least one photo",
      photoUploaded: "Photo uploaded.",
      photosUploaded: "Photos uploaded.",
      uploadPhotos: "Upload photos",
      homeCityOnMap: "Home city on the map",
      homeCityDesc: "Click the map to place a pin where you live now.",
      loadingMap: "Loading map…",
      clickMapFirst: "Click the map to place your pin first.",
      locationSaved: "Location saved.",
      saveLocation: "Save location",
      failedToSaveLocation: "Failed to save location",
      selectCountryFirst: "Select a country first",
      noResults: "No results found",
      playlistAdd: "Add to playlist",
      playlistDesc: "Leave a song from Erasmus — it will appear on the group page.",
      songName: "Song name",
      songNamePlaceholder: "Song name…",
      artist: "Artist",
      artistPlaceholder: "Artist…",
      spotifyUrl: "Spotify link (optional)",
      saveSong: "Add",
      songSaved: "Song added.",
      saveAll: "Save",
      unsavedChanges: "Unsaved changes",
      savedAll: "✓ Saved",
    },
    welcome: {
      title: (name) => `Welcome, ${name}! 👋`,
      intro: "This page is only for you — don't share your link with anyone.",
      privacy: "Only you can open this page — no one else can see it.",
      lead: "Here you can leave a few things:",
      items: [
        "✍️ Your favorite memory — only I will read it",
        "💌 A private note to Ali — only I will read it",
        "🎙️ A voice message — only I will listen",
        "📸 Photos — only I will see them",
        "📍 Your city — shown on the map",
      ],
      optional: "You don't have to fill everything in.",
      skip: "Leave what you want, skip what you don't.",
      button: "Okay, let's start →",
    },
    join: {
      greeting: "Welcome.",
      namePlaceholder: "Your name...",
      submit: "→ Join",
      continue: "→ Continue",
      joining: "Joining…",
    },
    enter: {
      title: "Enter",
      subtitle: "Enter the password to view the album.",
      passwordPlaceholder: "Password…",
      submit: "→ Enter",
      entering: "Entering…",
      wrongPassword: "Wrong password",
    },
    error: {
      title: "Something went wrong.",
      subtitle: "But the memories are still here.",
      retry: "← Go back",
    },
    notFound: {
      title: "This page doesn't exist.",
      subtitle: "Maybe it already belongs to the past.",
      home: "Back to home →",
    },
  },
  es: {
    landing: {
      subtitle: "ERASMUS • UCLM • 2025–26",
      tagline: "Se acabó. Pero no del todo.",
      enter: "→ Entrar",
      footer: "UCLM · Facultad de Letras · Ciudad Real",
    },
    common: {
      back: "Volver",
      home: "Inicio",
      saving: "Guardando…",
      uploading: "Subiendo…",
      somethingWentWrong: "Algo salió mal",
      failedToSave: "No se pudo guardar",
      uploadFailed: "Error al subir",
    },
    group: {
      subtitle: "Todos los que estuvieron allí — y dónde están ahora.",
      emptyProfiles:
        "Aún no hay perfiles. Comparte los enlaces de edición con tus amigos para empezar.",
      viewProfile: "Ver →",
      mapLink: "🗺️ Mapa",
      mapTitle: "Mapa",
      mapEmpty: "Nadie ha añadido su ubicación todavía.",
      playlist: "🎵 Playlist",
      playlistEmpty: "Aún no hay canciones.",
    },
    profile: {
      favoriteMemory: "Recuerdo favorito",
      noteToAli: "Nota para Ali",
      audioMessage: "Mensaje de audio",
      audioFrom: (name) => `Mensaje de audio de ${name}`,
      audioUnsupported: "Tu navegador no admite la reproducción de audio.",
      photos: "Fotos",
      photoBy: (name) => `Foto de ${name}`,
      photosPrivate:
        "Las fotos son privadas. Introduce tu token de admin para verlas.",
      home: "Hogar",
      loadingPhoto: "Cargando…",
      privatePhoto: "Foto privada — se requiere acceso de admin",
      photoError: "No se pudo cargar la foto",
      adminToken: "Token de admin",
      adminTokenPlaceholder: "Pega tu ADMIN_TOKEN",
      unlockPhotos: "Desbloquear fotos",
      unlocking: "Desbloqueando…",
      invalidToken: "Token inválido",
      nothingYet: (firstName) =>
        `Todavía no hay nada — vuelve cuando ${firstName} añada sus recuerdos.`,
      isThisYou: "¿Eres tú?",
      checkEditLink:
        "Revisa tu enlace personal de edición para actualizar tu perfil.",
    },
    edit: {
      accessDenied: "Acceso denegado",
      accessDeniedDesc:
        "Este enlace de edición no es válido o ha caducado. Solo tú deberías tener tu enlace personal — revisa la URL que te compartió tu amigo.",
      viewPublicProfile: "← Ver perfil público",
      viewProfile: "Ver perfil",
      title: (name) => `Editar — ${name}`,
      subtitle: "Comparte tus recuerdos. Solo tú puedes ver esta página.",
      partOf: "Parte de",
      name: "Nombre",
      country: "País",
      city: "Ciudad",
      flagEmoji: "Emoji de bandera",
      countryPlaceholder: "Seleccionar país…",
      cityPlaceholder: "Seleccionar ciudad…",
      countryHelper: "Elige de la lista o escribe",
      cityHelper: "Disponible después de seleccionar el país",
      flagPlaceholder: "🇪🇸",
      savedProfile: "Guardado — tu perfil ha sido actualizado.",
      saveChanges: "Guardar cambios",
      favoriteMemory: "Recuerdo favorito",
      favoriteMemoryDesc:
        "Un momento del Erasmus que quieres recordar — solo yo lo leeré.",
      favoriteMemoryPlaceholder: "Esa noche en la azotea cuando…",
      saveMemory: "Guardar recuerdo",
      memorySaved: "Recuerdo guardado.",
      noteToAli: "Nota para Ali",
      noteToAliDesc: "Una nota privada — solo Ali la leerá.",
      notePlaceholder: "Querido Ali…",
      saveNote: "Guardar nota",
      noteSaved: "Nota guardada.",
      audioMessage: "Mensaje de audio",
      audioMessageDesc:
        "Graba un mensaje de voz o sube un archivo de audio. Solo Ali puede escucharlo.",
      audioReplaceWarning:
        "Ya tienes un mensaje de audio. Grabar o subir uno nuevo lo reemplazará.",
      startRecording: "Empezar a grabar",
      stopRecording: "Detener grabación",
      uploadRecording: "Subir grabación",
      discard: "Descartar",
      orUploadFile: "O sube un archivo",
      audioSaved: "Mensaje de audio guardado.",
      micDenied: "Acceso al micrófono denegado o no disponible.",
      photos: "Fotos",
      photosDesc:
        "Sube una o más fotos. Se almacenan de forma privada — se necesita acceso de admin para verlas.",
      photosLabel: "Fotos",
      photosSelected: (count) =>
        `${count} foto${count !== 1 ? "s" : ""} seleccionada${count !== 1 ? "s" : ""}`,
      captionOptional: "Descripción de la primera foto (opcional)",
      captionPlaceholder: "Una nota sobre este momento…",
      choosePhoto: "Elige al menos una foto",
      photoUploaded: "Foto subida.",
      photosUploaded: "Fotos subidas.",
      uploadPhotos: "Subir fotos",
      homeCityOnMap: "Ciudad en el mapa",
      homeCityDesc: "Haz clic en el mapa para colocar un pin donde vives ahora.",
      loadingMap: "Cargando mapa…",
      clickMapFirst: "Haz clic en el mapa para colocar tu pin primero.",
      locationSaved: "Ubicación guardada.",
      saveLocation: "Guardar ubicación",
      failedToSaveLocation: "No se pudo guardar la ubicación",
      selectCountryFirst: "Selecciona un país primero",
      noResults: "No se encontraron resultados",
      playlistAdd: "Añadir a la playlist",
      playlistDesc: "Deja una canción del Erasmus — aparecerá en la página del grupo.",
      songName: "Nombre de la canción",
      songNamePlaceholder: "Nombre de la canción…",
      artist: "Artista",
      artistPlaceholder: "Artista…",
      spotifyUrl: "Enlace de Spotify (opcional)",
      saveSong: "Añadir",
      songSaved: "Canción añadida.",
      saveAll: "Guardar",
      unsavedChanges: "Cambios sin guardar",
      savedAll: "✓ Guardado",
    },
    welcome: {
      title: (name) => `¡Bienvenido/a, ${name}! 👋`,
      intro: "Esta página es solo para ti — no compartas tu enlace con nadie.",
      privacy: "Solo tú puedes abrir esta página — nadie más puede verla.",
      lead: "Aquí puedes dejar algunas cosas:",
      items: [
        "✍️ Tu recuerdo favorito — solo yo lo leeré",
        "💌 Una nota privada para Ali — solo yo la leeré",
        "🎙️ Un mensaje de voz — solo yo lo escucharé",
        "📸 Fotos — solo yo las veré",
        "📍 Tu ciudad — aparecerá en el mapa",
      ],
      optional: "No tienes que rellenar todo.",
      skip: "Deja lo que quieras, omite lo que no.",
      button: "Vale, empecemos →",
    },
    join: {
      greeting: "Bienvenido.",
      namePlaceholder: "Tu nombre...",
      submit: "→ Unirse",
      continue: "→ Continuar",
      joining: "Uniéndose…",
    },
    enter: {
      title: "Entrar",
      subtitle: "Introduce la contraseña para ver el álbum.",
      passwordPlaceholder: "Contraseña…",
      submit: "→ Entrar",
      entering: "Entrando…",
      wrongPassword: "Contraseña incorrecta",
    },
    error: {
      title: "Algo salió mal.",
      subtitle: "Pero los recuerdos siguen aquí.",
      retry: "← Volver",
    },
    notFound: {
      title: "Esta página no existe.",
      subtitle: "Quizá ya quedó en el pasado.",
      home: "Volver al inicio →",
    },
  },
  it: {
    landing: {
      subtitle: "ERASMUS • UCLM • 2025–26",
      tagline: "È finita. Ma non del tutto.",
      enter: "→ Entra",
      footer: "UCLM · Facoltà di Lettere · Ciudad Real",
    },
    common: {
      back: "Indietro",
      home: "Home",
      saving: "Salvataggio…",
      uploading: "Caricamento…",
      somethingWentWrong: "Qualcosa è andato storto",
      failedToSave: "Salvataggio non riuscito",
      uploadFailed: "Caricamento non riuscito",
    },
    group: {
      subtitle: "Tutti quelli che c'erano — e dove sono adesso.",
      emptyProfiles:
        "Nessun profilo ancora. Condividi i link di modifica con i tuoi amici per iniziare.",
      viewProfile: "Vedi →",
      mapLink: "🗺️ Mappa",
      mapTitle: "Mappa",
      mapEmpty: "Nessuno ha ancora aggiunto la propria posizione.",
      playlist: "🎵 Playlist",
      playlistEmpty: "Nessuna canzone aggiunta.",
    },
    profile: {
      favoriteMemory: "Ricordo preferito",
      noteToAli: "Nota per Ali",
      audioMessage: "Messaggio audio",
      audioFrom: (name) => `Messaggio audio da ${name}`,
      audioUnsupported: "Il tuo browser non supporta la riproduzione audio.",
      photos: "Foto",
      photoBy: (name) => `Foto di ${name}`,
      photosPrivate:
        "Le foto sono private. Inserisci il token admin per vederle.",
      home: "Casa",
      loadingPhoto: "Caricamento…",
      privatePhoto: "Foto privata — accesso admin richiesto",
      photoError: "Impossibile caricare la foto",
      adminToken: "Token admin",
      adminTokenPlaceholder: "Incolla il tuo ADMIN_TOKEN",
      unlockPhotos: "Sblocca foto",
      unlocking: "Sblocco…",
      invalidToken: "Token non valido",
      nothingYet: (firstName) =>
        `Non c'è ancora nulla — torna quando ${firstName} aggiungerà i suoi ricordi.`,
      isThisYou: "Sei tu?",
      checkEditLink:
        "Controlla il tuo link personale di modifica per aggiornare il profilo.",
    },
    edit: {
      accessDenied: "Accesso negato",
      accessDeniedDesc:
        "Questo link di modifica non è valido o è scaduto. Solo tu dovresti avere il tuo link personale — controlla l'URL che ti ha condiviso il tuo amico.",
      viewPublicProfile: "← Vedi profilo pubblico",
      viewProfile: "Vedi profilo",
      title: (name) => `Modifica — ${name}`,
      subtitle: "Condividi i tuoi ricordi. Solo tu puoi vedere questa pagina.",
      partOf: "Parte di",
      name: "Nome",
      country: "Paese",
      city: "Città",
      flagEmoji: "Emoji bandiera",
      countryPlaceholder: "Seleziona paese…",
      cityPlaceholder: "Seleziona città…",
      countryHelper: "Scegli dalla lista o digita",
      cityHelper: "Disponibile dopo aver selezionato il paese",
      flagPlaceholder: "🇪🇸",
      savedProfile: "Salvato — il tuo profilo è stato aggiornato.",
      saveChanges: "Salva modifiche",
      favoriteMemory: "Ricordo preferito",
      favoriteMemoryDesc:
        "Un momento dell'Erasmus che vuoi ricordare — solo io lo leggerò.",
      favoriteMemoryPlaceholder: "Quella sera sul tetto quando…",
      saveMemory: "Salva ricordo",
      memorySaved: "Ricordo salvato.",
      noteToAli: "Nota per Ali",
      noteToAliDesc: "Una nota privata — solo Ali la leggerà.",
      notePlaceholder: "Caro Ali…",
      saveNote: "Salva nota",
      noteSaved: "Nota salvata.",
      audioMessage: "Messaggio audio",
      audioMessageDesc:
        "Registra un messaggio vocale o carica un file audio. Solo Ali può ascoltarlo.",
      audioReplaceWarning:
        "Hai già un messaggio audio. Registrare o caricarne uno nuovo lo sostituirà.",
      startRecording: "Inizia registrazione",
      stopRecording: "Ferma registrazione",
      uploadRecording: "Carica registrazione",
      discard: "Elimina",
      orUploadFile: "Oppure carica un file",
      audioSaved: "Messaggio audio salvato.",
      micDenied: "Accesso al microfono negato o non disponibile.",
      photos: "Foto",
      photosDesc:
        "Carica una o più foto. Sono archiviate in privato — serve l'accesso admin per vederle.",
      photosLabel: "Foto",
      photosSelected: (count) =>
        `${count} foto selezionat${count !== 1 ? "e" : "a"}`,
      captionOptional: "Didascalia per la prima foto (opzionale)",
      captionPlaceholder: "Una nota su questo momento…",
      choosePhoto: "Scegli almeno una foto",
      photoUploaded: "Foto caricata.",
      photosUploaded: "Foto caricate.",
      uploadPhotos: "Carica foto",
      homeCityOnMap: "Città sulla mappa",
      homeCityDesc: "Clicca sulla mappa per posizionare un pin dove vivi adesso.",
      loadingMap: "Caricamento mappa…",
      clickMapFirst: "Clicca sulla mappa per posizionare il pin prima.",
      locationSaved: "Posizione salvata.",
      saveLocation: "Salva posizione",
      failedToSaveLocation: "Impossibile salvare la posizione",
      selectCountryFirst: "Seleziona prima un paese",
      noResults: "Nessun risultato trovato",
      playlistAdd: "Aggiungi alla playlist",
      playlistDesc: "Lascia una canzone dell'Erasmus — apparirà nella pagina del gruppo.",
      songName: "Nome della canzone",
      songNamePlaceholder: "Nome della canzone…",
      artist: "Artista",
      artistPlaceholder: "Artista…",
      spotifyUrl: "Link Spotify (opzionale)",
      saveSong: "Aggiungi",
      songSaved: "Canzone aggiunta.",
      saveAll: "Salva",
      unsavedChanges: "Modifiche non salvate",
      savedAll: "✓ Salvato",
    },
    welcome: {
      title: (name) => `Benvenuto/a, ${name}! 👋`,
      intro: "Questa pagina è solo per te — non condividere il tuo link con nessuno.",
      privacy: "Solo tu puoi aprire questa pagina — nessun altro può vederla.",
      lead: "Qui puoi lasciare alcune cose:",
      items: [
        "✍️ Il tuo ricordo preferito — solo io lo leggerò",
        "💌 Una nota privata per Ali — solo io la leggerò",
        "🎙️ Un messaggio vocale — solo io lo ascolterò",
        "📸 Foto — solo io le vedrò",
        "📍 La tua città — apparirà sulla mappa",
      ],
      optional: "Non devi compilare tutto.",
      skip: "Lascia quello che vuoi, salta quello che non vuoi.",
      button: "Ok, iniziamo →",
    },
    join: {
      greeting: "Benvenuto.",
      namePlaceholder: "Il tuo nome...",
      submit: "→ Partecipa",
      continue: "→ Continua",
      joining: "Accesso…",
    },
    enter: {
      title: "Entra",
      subtitle: "Inserisci la password per vedere l'album.",
      passwordPlaceholder: "Password…",
      submit: "→ Entra",
      entering: "Accesso…",
      wrongPassword: "Password errata",
    },
    error: {
      title: "Qualcosa è andato storto.",
      subtitle: "Ma i ricordi sono ancora qui.",
      retry: "← Indietro",
    },
    notFound: {
      title: "Questa pagina non esiste.",
      subtitle: "Forse è già rimasta nel passato.",
      home: "Torna alla home →",
    },
  },
  pt: {
    landing: {
      subtitle: "ERASMUS • UCLM • 2025–26",
      tagline: "Acabou. Mas não de verdade.",
      enter: "→ Entrar",
      footer: "UCLM · Faculdade de Letras · Ciudad Real",
    },
    common: {
      back: "Voltar",
      home: "Início",
      saving: "A guardar…",
      uploading: "A carregar…",
      somethingWentWrong: "Algo correu mal",
      failedToSave: "Falha ao guardar",
      uploadFailed: "Falha no carregamento",
    },
    group: {
      subtitle: "Todos os que estiveram lá — e onde estão agora.",
      emptyProfiles:
        "Ainda não há perfis. Partilha os links de edição com os teus amigos para começar.",
      viewProfile: "Ver →",
      mapLink: "🗺️ Mapa",
      mapTitle: "Mapa",
      mapEmpty: "Ainda ninguém adicionou a sua localização.",
      playlist: "🎵 Playlist",
      playlistEmpty: "Ainda não há músicas.",
    },
    profile: {
      favoriteMemory: "Memória favorita",
      noteToAli: "Nota para o Ali",
      audioMessage: "Mensagem de áudio",
      audioFrom: (name) => `Mensagem de áudio de ${name}`,
      audioUnsupported: "O teu browser não suporta reprodução de áudio.",
      photos: "Fotos",
      photoBy: (name) => `Foto de ${name}`,
      photosPrivate:
        "As fotos são privadas. Introduz o teu token de admin para as ver.",
      home: "Casa",
      loadingPhoto: "A carregar…",
      privatePhoto: "Foto privada — acesso de admin necessário",
      photoError: "Não foi possível carregar a foto",
      adminToken: "Token de admin",
      adminTokenPlaceholder: "Cola o teu ADMIN_TOKEN",
      unlockPhotos: "Desbloquear fotos",
      unlocking: "A desbloquear…",
      invalidToken: "Token inválido",
      nothingYet: (firstName) =>
        `Ainda não há nada — volta quando ${firstName} adicionar as suas memórias.`,
      isThisYou: "És tu?",
      checkEditLink:
        "Verifica o teu link pessoal de edição para atualizar o teu perfil.",
    },
    edit: {
      accessDenied: "Acesso negado",
      accessDeniedDesc:
        "Este link de edição é inválido ou expirou. Só tu deves ter o teu link pessoal — verifica o URL que o teu amigo partilhou contigo.",
      viewPublicProfile: "← Ver perfil público",
      viewProfile: "Ver perfil",
      title: (name) => `Editar — ${name}`,
      subtitle: "Partilha as tuas memórias. Só tu podes ver esta página.",
      partOf: "Parte de",
      name: "Nome",
      country: "País",
      city: "Cidade",
      flagEmoji: "Emoji da bandeira",
      countryPlaceholder: "Selecionar país…",
      cityPlaceholder: "Selecionar cidade…",
      countryHelper: "Escolhe da lista ou escreve",
      cityHelper: "Disponível depois de selecionar o país",
      flagPlaceholder: "🇪🇸",
      savedProfile: "Guardado — o teu perfil foi atualizado.",
      saveChanges: "Guardar alterações",
      favoriteMemory: "Memória favorita",
      favoriteMemoryDesc:
        "Um momento do Erasmus que queres recordar — só eu vou ler.",
      favoriteMemoryPlaceholder: "Aquela noite no telhado quando…",
      saveMemory: "Guardar memória",
      memorySaved: "Memória guardada.",
      noteToAli: "Nota para o Ali",
      noteToAliDesc: "Uma nota privada — só o Ali a vai ler.",
      notePlaceholder: "Querido Ali…",
      saveNote: "Guardar nota",
      noteSaved: "Nota guardada.",
      audioMessage: "Mensagem de áudio",
      audioMessageDesc:
        "Grava uma mensagem de voz ou carrega um ficheiro de áudio. Só o Ali pode ouvir.",
      audioReplaceWarning:
        "Já tens uma mensagem de áudio. Gravar ou carregar uma nova vai substituí-la.",
      startRecording: "Começar gravação",
      stopRecording: "Parar gravação",
      uploadRecording: "Carregar gravação",
      discard: "Descartar",
      orUploadFile: "Ou carrega um ficheiro",
      audioSaved: "Mensagem de áudio guardada.",
      micDenied: "Acesso ao microfone negado ou indisponível.",
      photos: "Fotos",
      photosDesc:
        "Carrega uma ou mais fotos. São guardadas em privado — é preciso acesso de admin para as ver.",
      photosLabel: "Fotos",
      photosSelected: (count) =>
        `${count} foto${count !== 1 ? "s" : ""} selecionada${count !== 1 ? "s" : ""}`,
      captionOptional: "Legenda da primeira foto (opcional)",
      captionPlaceholder: "Uma nota sobre este momento…",
      choosePhoto: "Escolhe pelo menos uma foto",
      photoUploaded: "Foto carregada.",
      photosUploaded: "Fotos carregadas.",
      uploadPhotos: "Carregar fotos",
      homeCityOnMap: "Cidade no mapa",
      homeCityDesc: "Clica no mapa para colocar um pin onde vives agora.",
      loadingMap: "A carregar mapa…",
      clickMapFirst: "Clica no mapa para colocar o teu pin primeiro.",
      locationSaved: "Localização guardada.",
      saveLocation: "Guardar localização",
      failedToSaveLocation: "Falha ao guardar localização",
      selectCountryFirst: "Seleciona um país primeiro",
      noResults: "Nenhum resultado encontrado",
      playlistAdd: "Adicionar à playlist",
      playlistDesc: "Deixa uma música do Erasmus — aparecerá na página do grupo.",
      songName: "Nome da música",
      songNamePlaceholder: "Nome da música…",
      artist: "Artista",
      artistPlaceholder: "Artista…",
      spotifyUrl: "Link Spotify (opcional)",
      saveSong: "Adicionar",
      songSaved: "Música adicionada.",
      saveAll: "Guardar",
      unsavedChanges: "Alterações por guardar",
      savedAll: "✓ Guardado",
    },
    welcome: {
      title: (name) => `Bem-vindo/a, ${name}! 👋`,
      intro: "Esta página é só para ti — não partilhes o teu link com ninguém.",
      privacy: "Só tu podes abrir esta página — mais ninguém a pode ver.",
      lead: "Aqui podes deixar algumas coisas:",
      items: [
        "✍️ A tua memória favorita — só eu vou ler",
        "💌 Uma nota privada para o Ali — só eu vou ler",
        "🎙️ Uma mensagem de voz — só eu vou ouvir",
        "📸 Fotos — só eu vou ver",
        "📍 A tua cidade — aparecerá no mapa",
      ],
      optional: "Não tens de preencher tudo.",
      skip: "Deixa o que quiseres, salta o que não quiseres.",
      button: "Ok, vamos começar →",
    },
    join: {
      greeting: "Bem-vindo.",
      namePlaceholder: "O teu nome...",
      submit: "→ Entrar",
      continue: "→ Continuar",
      joining: "A entrar…",
    },
    enter: {
      title: "Entrar",
      subtitle: "Introduz a palavra-passe para ver o álbum.",
      passwordPlaceholder: "Palavra-passe…",
      submit: "→ Entrar",
      entering: "A entrar…",
      wrongPassword: "Palavra-passe incorreta",
    },
    error: {
      title: "Algo correu mal.",
      subtitle: "Mas as memórias ainda estão aqui.",
      retry: "← Voltar",
    },
    notFound: {
      title: "Esta página não existe.",
      subtitle: "Talvez já tenha ficado no passado.",
      home: "Voltar ao início →",
    },
  },
};
