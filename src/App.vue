<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-white dark:bg-gray-900">
    <body class="h-full">
    ```
  -->
  <div>
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
        <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="" leave="transition-opacity ease-linear duration-300" leave-from="" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900/80" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="" leave="ease-in-out duration-300" leave-from="" leave-to="opacity-0">
                <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </TransitionChild>

              <!-- Sidebar component, swap this element with another sidebar if you like -->
              <div class="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 dark:bg-gray-900 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-r dark:before:border-white/10 dark:before:bg-black/10">
                <div class="relative flex h-16 shrink-0 items-center">
                    <RouterLink
                      to="/"
                      class="inline-flex items-center gap-2"
                      aria-label="GeoBrewery home"
                    >
                      <!-- Logo (handles dark mode with Tailwind) -->
                      <img class="h-8 w-auto dark:hidden" :src="BrewLogo" alt="GeoBrewery" />
                      <img class="hidden h-8 w-auto dark:block" :src="BrewLogo" alt="GeoBrewery (dark)" />

                      <!-- Wordmark -->
                      <span class="text-lg font-semibold tracking-tight leading-none text-gray-900 dark:text-gray-100">
                        <span class="text-green-600 dark:text-green-400">Geo</span>Brewery
                      </span>
                    </RouterLink>
                </div>
                <nav class="relative flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" class="-mx-2 space-y-1">
                        <li v-for="item in navigation" :key="item.name">
                          <a :href="item.href" :class="[item.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                            <component :is="item.icon" :class="[item.current ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-white', 'size-6 shrink-0']" aria-hidden="true" />
                            {{ item.name }}
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <div class="text-xs/6 font-semibold text-gray-400 dark:text-gray-500">Advanced features</div>
                      <ul role="list" class="-mx-2 mt-2 space-y-1">
                        <li v-for="team in teams" :key="team.name">
                          <a v-if="!team.disabled" :href="team.href" :class="[team.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                            <component v-if="team.icon" :is="team.icon" :class="[team.current ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-white', 'size-6 shrink-0']" aria-hidden="true" />
                            <span v-else :class="[team.current ? 'border-indigo-600 text-indigo-600 dark:border-white/20 dark:text-white' : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white', 'flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5']">{{ team.initial || team.name.charAt(0) }}</span>
                            <span class="truncate">{{ team.name }}</span>
                          </a>
                          <div v-else :class="['text-gray-400 dark:text-gray-500', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-not-allowed opacity-50']">
                            <component v-if="team.icon" :is="team.icon" class="size-6 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                            <span v-else class="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 bg-white text-[0.625rem] font-medium dark:bg-white/5 dark:border-white/10">{{ team.initial || team.name.charAt(0) }}</span>
                            <span class="truncate">{{ team.name }}</span>
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="relative flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 dark:border-white/10 dark:bg-gray-900 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">
        <div class="relative flex h-16 shrink-0 items-center">
          <RouterLink
            to="/"
            class="inline-flex items-center gap-2"
            aria-label="GeoBrewery home"
          >
            <!-- Logo (handles dark mode with Tailwind) -->
            <img class="h-8 w-auto dark:hidden" :src="BrewLogo" alt="GeoBrewery" />
            <img class="hidden h-8 w-auto dark:block" :src="BrewLogo" alt="GeoBrewery (dark)" />

            <!-- Wordmark -->
            <span class="text-lg font-semibold tracking-tight leading-none text-gray-900 dark:text-gray-100">
              <span class="text-green-600 dark:text-green-400">Geo</span>Brewery
            </span>
          </RouterLink>
        </div>
        <nav class="relative flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navigation" :key="item.name">
                  <a :href="item.href" :class="[item.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                    <component :is="item.icon" :class="[item.current ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-white', 'size-6 shrink-0']" aria-hidden="true" />
                    {{ item.name }}
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <div class="text-xs/6 font-semibold text-gray-400 dark:text-gray-500">Advanced features</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="team in teams" :key="team.name">
                  <a v-if="!team.disabled" :href="team.href" :class="[team.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                    <component v-if="team.icon" :is="team.icon" :class="[team.current ? 'text-indigo-600 dark:text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-white', 'size-6 shrink-0']" aria-hidden="true" />
                    <span v-else :class="[team.current ? 'border-indigo-600 text-indigo-600 dark:border-white/20 dark:text-white' : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white', 'flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5']">{{ team.initial || team.name.charAt(0) }}</span>
                    <span class="truncate">{{ team.name }}</span>
                  </a>
                  <div v-else :class="['text-gray-400 dark:text-gray-500', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-not-allowed opacity-50']">
                    <component v-if="team.icon" :is="team.icon" class="size-6 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                    <span v-else class="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 bg-white text-[0.625rem] font-medium dark:bg-white/5 dark:border-white/10">{{ team.initial || team.name.charAt(0) }}</span>
                    <span class="truncate">{{ team.name }}</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden dark:bg-gray-900 dark:shadow-none dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-b dark:before:border-white/10 dark:before:bg-black/10">
      <button type="button" class="relative -m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-400" @click="sidebarOpen = true">
        <span class="sr-only">Open sidebar</span>
        <Bars3Icon class="size-6" aria-hidden="true" />
      </button>
      <div class="relative flex-1 text-sm/6 font-semibold text-gray-900 dark:text-white">Dashboard</div>
    </div>

    <main class="lg:pl-72 flex flex-col h-screen">
      <!-- Startup Message -->
      <div v-if="!locationData && !startupMessageDismissed" class="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div class="px-4 py-3 sm:px-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Welcome to GeoBrewery
              </h3>
              <div class="mt-1 text-sm text-blue-700 dark:text-blue-300">
                <p>Click anywhere on the map to analyze brewery data, market opportunities, and beer styles for that location.</p>
              </div>
            </div>
            <div class="ml-auto pl-3">
              <div class="-mx-1.5 -my-1.5">
                <button @click="dismissStartupMessage" type="button" class="inline-flex rounded-md bg-blue-50 p-1.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">
                  <span class="sr-only">Dismiss</span>
                  <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div :class="['flex-1 overflow-hidden transition-[padding] duration-200', detailsOpen ? 'sm:pr-96' : '']">
        <Map ref="mapRef" @location-selected="onLocationSelected" />
      </div>
    </main>

  <aside
    v-show="detailsOpen"
    class="fixed inset-y-0 right-0 w-full sm:w-96 overflow-y-auto border-l border-gray-200 bg-white px-4 py-6 sm:px-6 lg:px-8 dark:border-white/10 dark:bg-gray-900 z-40"
  >
    <div class="flex items-start justify-between">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white">Location Analysis</h2>
      <button @click="closeDetails" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-white/10">
        <XMarkIcon class="size-5" />
        <span class="sr-only">Close panel</span>
      </button>
    </div>

    <!-- Radius Selection -->
    <div v-if="locationData && !locationData.loading && !locationData.error" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div class="flex items-center justify-between mb-3">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Search Radius</label>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ searchRadius }} miles</span>
      </div>
      <input
        v-model="searchRadius"
        type="range"
        min="10"
        max="100"
        step="10"
        @change="updateSearchRadius"
        class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
      <div class="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
        <span>10 mi</span>
        <span>100 mi</span>
      </div>
    </div>

    <div v-if="locationData" class="mt-6 space-y-6">
      <div v-if="locationData.loading" class="text-center py-12">
        <div class="relative">
          <div class="w-16 h-16 mx-auto mb-4">
            <div class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 dark:border-t-green-400 animate-spin"></div>
          </div>
          <div class="space-y-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Analyzing Location</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Gathering brewery data and market insights...</p>
            <div class="flex justify-center space-x-1 mt-4">
              <div class="w-2 h-2 bg-indigo-600 dark:bg-green-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-indigo-600 dark:bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-indigo-600 dark:bg-green-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="locationData.error" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Unable to Load Data</h3>
          <p class="text-sm text-red-600 dark:text-red-400">{{ locationData.error }}</p>
          <button @click="retryLocationAnalysis" class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
            Try Again
          </button>
        </div>
      </div>

      <div v-else>
        <div v-if="locationData.stateName">
          <div class="text-lg font-semibold text-white">{{ locationData.stateName }}</div>
          <div class="mt-1 text-sm text-gray-500">State ID: {{ locationData.stateId }}</div>
        </div>
        <div v-else>
          <div class="text-lg font-semibold text-gray-500">No state detected</div>
          <div class="mt-1 text-sm text-gray-500">Try clicking within US borders</div>
        </div>

        <!-- Skeleton Loading States -->
        <div v-if="!locationData.populationData && !locationData.error" class="mt-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
              <div class="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div class="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="i in 4" :key="i" class="rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gray-50 dark:bg-gray-800/50 animate-pulse">
              <div class="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div class="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
              <div class="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Population Data -->
        <div v-if="locationData.populationData" class="mt-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <UserGroupIcon class="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">State Demographics</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div class="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 dark:bg-blue-800/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                  <UserGroupIcon class="size-4" />
                  Population 21+
                </div>
                <div class="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-1">{{ locationData.populationData['pop21up (first)']?.toLocaleString() }}</div>
                <div class="text-xs text-blue-600/70 dark:text-blue-400/70">adults</div>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div class="absolute top-0 right-0 w-20 h-20 bg-green-200/20 dark:bg-green-800/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                  <BeakerIcon class="size-4" />
                  Per Capita (21+)
                </div>
                <div class="text-2xl font-bold text-green-800 dark:text-green-200 mb-1">{{ locationData.populationData['gallons_eth / pop21up'] }}</div>
                <div class="text-xs text-green-600/70 dark:text-green-400/70">gallons/year</div>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div class="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 dark:bg-purple-800/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">
                  <ChartBarIcon class="size-4" />
                  Total Ethanol
                </div>
                <div class="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-1">{{ locationData.populationData['Total gallons_eth']?.toLocaleString() }}</div>
                <div class="text-xs text-purple-600/70 dark:text-purple-400/70">gallons</div>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div class="absolute top-0 right-0 w-20 h-20 bg-orange-200/20 dark:bg-orange-800/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium text-orange-600 dark:text-orange-400 mb-2">
                  <BeakerIcon class="size-4" />
                  Total Beverage
                </div>
                <div class="text-2xl font-bold text-orange-800 dark:text-orange-200 mb-1">{{ locationData.populationData['Total gallons_bev']?.toLocaleString() }}</div>
                <div class="text-xs text-orange-600/70 dark:text-orange-400/70">gallons</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Nearby Breweries -->
        <div v-if="locationData.nearbyBreweries && locationData.nearbyBreweries.length > 0" class="mt-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <MapPinIcon class="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ locationData.isNearestBreweries ? 'Nearest Breweries' : 'Nearby Breweries' }} ({{ locationData.nearbyBreweries.length }})
            </h3>
          </div>
          <div v-if="locationData.isNearestBreweries" class="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div class="flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-200">
              <svg class="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              No breweries found within 50 miles. Showing the nearest breweries instead.
            </div>
          </div>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div v-for="brewery in locationData.nearbyBreweries.slice(0, 10)" :key="brewery.id" class="rounded-lg border border-gray-200 p-3 dark:border-white/10">
              <div class="text-sm font-medium text-white">{{ brewery.name }}</div>
              <div class="text-xs text-gray-400">{{ brewery.city }}, {{ brewery.state }}</div>
              <div class="text-xs text-emerald-400 mt-1">{{ brewery.distance.toFixed(1) }} miles away</div>
            </div>
            <div v-if="locationData.nearbyBreweries.length > 10" class="text-xs text-gray-400 text-center py-2">
              +{{ locationData.nearbyBreweries.length - 10 }} more
            </div>
          </div>
        </div>

        <!-- Brewery Analysis -->
        <div v-if="locationData.breweryAnalysis" class="mt-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <BuildingOfficeIcon class="size-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Brewery Analysis</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div class="absolute top-0 right-0 w-20 h-20 bg-green-200/20 dark:bg-green-800/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium text-green-600 dark:text-green-400 mb-2">
                  <BeakerIcon class="size-4" />
                  Total Beers
                </div>
                <div class="text-2xl font-bold text-green-800 dark:text-green-200 mb-1">{{ locationData.breweryAnalysis.totalBeers }}</div>
                <div class="text-xs text-green-600/70 dark:text-green-400/70">unique beers</div>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div class="absolute top-0 right-0 w-20 h-20 bg-yellow-200/20 dark:bg-yellow-800/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-2">
                  <ChartBarIcon class="size-4" />
                  Avg ABV
                </div>
                <div class="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-1">{{ locationData.breweryAnalysis.avgAbv }}%</div>
                <div class="text-xs text-yellow-600/70 dark:text-yellow-400/70">alcohol by volume</div>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div class="absolute top-0 right-0 w-20 h-20 bg-red-200/20 dark:bg-red-800/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 mb-2">
                  <ChartBarIcon class="size-4" />
                  Avg IBU
                </div>
                <div class="text-2xl font-bold text-red-800 dark:text-red-200 mb-1">{{ locationData.breweryAnalysis.avgIbu }}</div>
                <div class="text-xs text-red-600/70 dark:text-red-400/70">bitterness units</div>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div class="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 dark:bg-purple-800/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">
                  <BeakerIcon class="size-4" />
                  Unique Styles
                </div>
                <div class="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-1">{{ locationData.breweryAnalysis.uniqueStyles }}</div>
                <div class="text-xs text-purple-600/70 dark:text-purple-400/70">beer styles</div>
              </div>
            </div>
          </div>

          <!-- Top Beer Styles -->
          <div v-if="locationData.breweryAnalysis.topStyles.length > 0" class="mt-4">
            <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <BeakerIcon class="size-4" />
              Popular Styles
            </div>
            <div class="flex flex-wrap gap-1">
              <span v-for="style in locationData.breweryAnalysis.topStyles" :key="style"
                    class="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900 dark:text-green-200 font-medium">
                {{ style }}
              </span>
            </div>
          </div>
        </div>

        <!-- Beer Style Analysis -->
        <div v-if="locationData.beerStyleAnalysis && locationData.beerStyleAnalysis.length > 0" class="mt-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <BeakerIcon class="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Beer Style Breakdown</h3>
          </div>
          <!-- Chart Visualization -->
          <div class="mb-6">
            <BeerStyleChart :beer-styles="locationData.beerStyleAnalysis" />
          </div>

          <!-- Detailed List -->
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div v-for="style in locationData.beerStyleAnalysis.slice(0, 8)" :key="style.style"
                 class="rounded-lg border border-gray-200 p-3 dark:border-white/10">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-sm font-medium text-white">{{ style.style }}</div>
                  <div class="text-xs text-gray-400">{{ style.count }} beers</div>
                </div>
                <div class="text-right text-xs text-gray-400">
                  <div>ABV: {{ style.avgAbv }}%</div>
                  <div>IBU: {{ style.avgIbu }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Market Analysis -->
        <div v-if="locationData.marketAnalysis" class="mt-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <CurrencyDollarIcon class="size-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Market Analysis</h3>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div class="absolute top-0 right-0 w-20 h-20 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                  <UserGroupIcon class="size-4" />
                  Market Saturation
                </div>
                <div class="text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-1">{{ locationData.marketAnalysis.marketSaturation }}</div>
                <div class="text-xs text-indigo-600/70 dark:text-indigo-400/70">people per brewery</div>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div class="absolute top-0 right-0 w-20 h-20 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">
                  <BeakerIcon class="size-4" />
                  Consumption per Capita
                </div>
                <div class="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-1">{{ locationData.marketAnalysis.consumptionPerCapita }}</div>
                <div class="text-xs text-emerald-600/70 dark:text-emerald-400/70">gallons/year</div>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200" :class="{
              'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10': locationData.marketAnalysis.marketOpportunity === 'High',
              'bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10': locationData.marketAnalysis.marketOpportunity === 'Medium',
              'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10': locationData.marketAnalysis.marketOpportunity === 'Low'
            }">
              <div class="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-10 translate-x-10" :class="{
                'bg-green-200/20 dark:bg-green-800/20': locationData.marketAnalysis.marketOpportunity === 'High',
                'bg-yellow-200/20 dark:bg-yellow-800/20': locationData.marketAnalysis.marketOpportunity === 'Medium',
                'bg-red-200/20 dark:bg-red-800/20': locationData.marketAnalysis.marketOpportunity === 'Low'
              }"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium mb-2" :class="{
                  'text-green-600 dark:text-green-400': locationData.marketAnalysis.marketOpportunity === 'High',
                  'text-yellow-600 dark:text-yellow-400': locationData.marketAnalysis.marketOpportunity === 'Medium',
                  'text-red-600 dark:text-red-400': locationData.marketAnalysis.marketOpportunity === 'Low'
                }">
                  <ChartPieIcon class="size-4" />
                  Market Opportunity
                </div>
                <div class="text-2xl font-bold mb-1" :class="{
                  'text-green-800 dark:text-green-200': locationData.marketAnalysis.marketOpportunity === 'High',
                  'text-yellow-800 dark:text-yellow-200': locationData.marketAnalysis.marketOpportunity === 'Medium',
                  'text-red-800 dark:text-red-200': locationData.marketAnalysis.marketOpportunity === 'Low'
                }">{{ locationData.marketAnalysis.marketOpportunity }}</div>
                <div class="text-xs" :class="{
                  'text-green-600/70 dark:text-green-400/70': locationData.marketAnalysis.marketOpportunity === 'High',
                  'text-yellow-600/70 dark:text-yellow-400/70': locationData.marketAnalysis.marketOpportunity === 'Medium',
                  'text-red-600/70 dark:text-red-400/70': locationData.marketAnalysis.marketOpportunity === 'Low'
                }">opportunity level</div>
              </div>
            </div>
            <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 shadow-sm hover:shadow-md transition-all duration-200">
              <div class="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 dark:bg-purple-800/20 rounded-full -translate-y-10 translate-x-10"></div>
              <div class="relative">
                <div class="flex items-center gap-2 text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">
                  <ChartBarIcon class="size-4" />
                  Total Consumption
                </div>
                <div class="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-1">{{ locationData.marketAnalysis.totalConsumption?.toLocaleString() }}</div>
                <div class="text-xs text-purple-600/70 dark:text-purple-400/70">gallons ethanol</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Brewery Density -->
        <div v-if="locationData.breweryDensity" class="mt-8">
          <div class="flex items-center gap-3 mb-4">
            <div class="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
              <ChartBarIcon class="size-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Brewery Density</h3>
          </div>
          <div class="group relative overflow-hidden rounded-xl border border-gray-200/50 p-4 dark:border-white/10 bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-900/20 dark:to-cyan-800/10 shadow-sm hover:shadow-md transition-all duration-200">
            <div class="absolute top-0 right-0 w-20 h-20 bg-cyan-200/20 dark:bg-cyan-800/20 rounded-full -translate-y-10 translate-x-10"></div>
            <div class="relative">
              <div class="flex items-center gap-2 text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-2">
                <MapPinIcon class="size-4" />
                Brewery Count
              </div>
              <div class="text-2xl font-bold text-cyan-800 dark:text-cyan-200 mb-1">{{ locationData.breweryDensity.count }} breweries</div>
              <div class="text-xs text-cyan-600/70 dark:text-cyan-400/70">{{ locationData.breweryDensity.density.toFixed(4) }} per sq mile</div>
            </div>
          </div>

          <!-- Search Radius Info -->
          <div class="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div class="flex items-center gap-2 text-xs text-orange-800 dark:text-orange-200">
              <svg class="size-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              Search radius: 50 miles (shown as orange circle on map)
            </div>
          </div>
        </div>

        <!-- Coordinates -->
        <dl class="divide-y divide-gray-200 dark:divide-white/10 rounded-lg border border-gray-200 dark:border-white/10 mt-6">
          <div class="grid grid-cols-3 gap-4 p-3">
            <dt class="text-sm text-gray-400">Latitude</dt>
            <dd class="col-span-2 text-sm font-medium text-white">{{ locationData.lat.toFixed(4) }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-4 p-3">
            <dt class="text-sm text-gray-400">Longitude</dt>
            <dd class="col-span-2 text-sm font-medium text-white">{{ locationData.lng.toFixed(4) }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div v-else class="mt-6 text-sm text-gray-400">
      Click on the map to see location details.
    </div>
  </aside>

  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Bars3Icon,
  ChartPieIcon,
  XMarkIcon,
  BeakerIcon,
  MapPinIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  TagIcon,
} from '@heroicons/vue/24/outline'

import Map from '@/components/Map.vue'
import BeerStyleChart from '@/components/BeerStyleChart.vue'
import BrewLogo from '@/assets/globe_logo.svg'
import { findStateForLocation } from '@/services/stateService'
import { findBreweriesNearLocation, getBreweryDensity, getNearestBreweries } from '@/services/breweryService'
import { getLatestStateData, getLatestStateDataRaw } from '@/services/populationService'
import { getBeersByBrewery } from '@/services/beerService'

const navigation = [
  { name: 'Dashboard', href: '#', icon: GlobeAltIcon, current: true },
]
const teams = [
  { id: 1, name: 'Optimization', href: '#', icon: TagIcon, current: false, disabled: true, initial: 'O' },
]

const sidebarOpen = ref(false)
const detailsOpen = ref(false)
const locationData = ref<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
const startupMessageDismissed = ref(false)
const searchRadius = ref(50)

const mapRef = ref<InstanceType<typeof Map> | null>(null)

async function onLocationSelected(p: { lat: number; lng: number }) {
  detailsOpen.value = true

  locationData.value = { ...p, loading: true }

  await nextTick()
  mapRef.value?.resize()
  mapRef.value?.recenterOn(p.lat, p.lng)

  // Show radius circle to indicate search area
  mapRef.value?.showRadiusCircle(p.lat, p.lng, searchRadius.value)

  try {
    const stateResult = await findStateForLocation(p.lng, p.lat)
    const nearbyBreweries = await findBreweriesNearLocation(p.lat, p.lng, searchRadius.value)
    const breweryDensity = await getBreweryDensity(p.lat, p.lng, searchRadius.value)

    // If no nearby breweries found, get the nearest ones
    let displayBreweries = nearbyBreweries
    let isNearestBreweries = false
    if (nearbyBreweries.length === 0) {
      displayBreweries = await getNearestBreweries(p.lat, p.lng, 10)
      isNearestBreweries = true
    }

    // Highlight the state if detected
    if (stateResult) {
      mapRef.value?.highlightState(stateResult.stateId)
    } else {
      mapRef.value?.clearStateHighlight()
    }

    let populationData = null
    let rawPopulationData = null
    if (stateResult) {
      populationData = await getLatestStateData(stateResult.stateId)
      rawPopulationData = await getLatestStateDataRaw(stateResult.stateId)
    }

    // Enhanced brewery analysis with beer data
    let breweryAnalysis = null
    let beerStyleAnalysis = null
    let marketAnalysis = null

    if (displayBreweries && displayBreweries.length > 0) {
      // Analyze beers for nearby breweries
      const breweryIds = displayBreweries.map(b => parseInt(b.id))
      const allBeers = []

      for (const breweryId of breweryIds) {
        const breweryBeers = await getBeersByBrewery(breweryId)
        allBeers.push(...breweryBeers)
      }

      // Calculate brewery analysis
      const totalBeers = allBeers.length
      const avgAbv = allBeers.length > 0 ? allBeers.reduce((sum, beer) => sum + beer.abv, 0) / allBeers.length : 0
      const beersWithIbu = allBeers.filter(beer => beer.ibu != null)
      const avgIbu = beersWithIbu.length > 0 ? beersWithIbu.reduce((sum, beer) => sum + (beer.ibu || 0), 0) / beersWithIbu.length : null

      // Get unique styles
      const uniqueStyles = [...new Set(allBeers.map(beer => beer.style))].filter(style => style && style.trim() !== '')

      breweryAnalysis = {
        totalBeers,
        avgAbv: avgAbv.toFixed(2),
        avgIbu: avgIbu ? avgIbu.toFixed(1) : 'N/A',
        uniqueStyles: uniqueStyles.length,
        topStyles: uniqueStyles.slice(0, 5)
      }

      // Get beer style analysis for the area
      const styleData: Record<string, { count: number; abvSum: number; ibuSum: number; ibuCount: number }> = {}
      for (const beer of allBeers) {
        const style = beer.style || 'Unknown'
        if (!styleData[style]) {
          styleData[style] = { count: 0, abvSum: 0, ibuSum: 0, ibuCount: 0 }
        }
        const data = styleData[style]
        data.count++
        data.abvSum += beer.abv
        if (beer.ibu != null) {
          data.ibuSum += beer.ibu
          data.ibuCount++
        }
      }

      beerStyleAnalysis = Object.entries(styleData)
        .map(([style, data]) => ({
          style,
          count: data.count,
          avgAbv: (data.abvSum / data.count).toFixed(2),
          avgIbu: data.ibuCount > 0 ? (data.ibuSum / data.ibuCount).toFixed(1) : 'N/A'
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Market analysis
      if (rawPopulationData) {
        console.log('Raw population data received:', rawPopulationData)

        const population21Plus = rawPopulationData.population21Plus
        const breweryCount = displayBreweries.length

        console.log('Market analysis values:', {
          population21Plus,
          breweryCount,
          consumptionPerCapita: rawPopulationData.consumptionPerCapita,
          totalConsumption: rawPopulationData.totalConsumption,
          year: rawPopulationData.year
        })

        // For market saturation, we'll use a more appropriate calculation
        // Since we have local breweries but state population, let's calculate local market saturation
        // by estimating local population based on the search radius
        const searchRadiusMiles = 50
        const searchAreaSqMiles = Math.PI * searchRadiusMiles * searchRadiusMiles
        const estimatedLocalPopulation = Math.max(1, Math.round(population21Plus * (searchAreaSqMiles / 100000))) // Rough estimate

        const marketSaturation = breweryCount > 0 ? Math.round(estimatedLocalPopulation / breweryCount) : 'N/A'
        const consumptionPerCapita = rawPopulationData.consumptionPerCapita
        const totalConsumption = rawPopulationData.totalConsumption

        marketAnalysis = {
          marketSaturation: marketSaturation.toString(),
          consumptionPerCapita: consumptionPerCapita.toFixed(2),
          totalConsumption,
          marketOpportunity: breweryCount < 5 ? 'High' : breweryCount < 10 ? 'Medium' : 'Low'
        }
      }
    }

    locationData.value = {
      lat: p.lat,
      lng: p.lng,
      stateId: stateResult?.stateId,
      stateName: stateResult?.stateName,
      nearbyBreweries: displayBreweries,
      isNearestBreweries,
      breweryDensity,
      populationData,
      breweryAnalysis,
      beerStyleAnalysis,
      marketAnalysis,
      loading: false
    }
  } catch (error) {
    console.error('Error loading location data:', error)
    locationData.value = {
      ...p,
      error: 'Failed to load location data',
      loading: false
    }
  }
}

function closeDetails() {
  detailsOpen.value = false
  // Clear state highlight and radius circle when closing details
  mapRef.value?.clearStateHighlight()
  mapRef.value?.clearRadiusCircle()
}

function dismissStartupMessage() {
  startupMessageDismissed.value = true
}

function retryLocationAnalysis() {
  if (locationData.value && locationData.value.lat && locationData.value.lng) {
    onLocationSelected({ lat: locationData.value.lat, lng: locationData.value.lng })
  }
}

function updateSearchRadius() {
  if (locationData.value && locationData.value.lat && locationData.value.lng) {
    // Update the radius circle on the map
    mapRef.value?.showRadiusCircle(locationData.value.lat, locationData.value.lng, searchRadius.value)

    // Re-analyze the location with the new radius
    onLocationSelected({ lat: locationData.value.lat, lng: locationData.value.lng })
  }
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark .slider::-webkit-slider-thumb {
  background: #10B981;
  border-color: #1F2937;
}

.dark .slider::-moz-range-thumb {
  background: #10B981;
  border-color: #1F2937;
}
</style>
