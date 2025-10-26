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
                      <div class="text-xs/6 font-semibold text-gray-400 dark:text-gray-500">Your teams</div>
                      <ul role="list" class="-mx-2 mt-2 space-y-1">
                        <li v-for="team in teams" :key="team.name">
                          <a :href="team.href" :class="[team.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                            <span :class="[team.current ? 'border-indigo-600 text-indigo-600 dark:border-white/20 dark:text-white' : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white', 'flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5']">{{ team.initial }}</span>
                            <span class="truncate">{{ team.name }}</span>
                          </a>
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
              <div class="text-xs/6 font-semibold text-gray-400 dark:text-gray-500">Your teams</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="team in teams" :key="team.name">
                  <a :href="team.href" :class="[team.current ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                    <span :class="[team.current ? 'border-indigo-600 text-indigo-600 dark:border-white/20 dark:text-white' : 'border-gray-200 text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600 dark:border-white/10 dark:group-hover:border-white/20 dark:group-hover:text-white', 'flex size-6 shrink-0 items-center justify-center rounded-lg border bg-white text-[0.625rem] font-medium dark:bg-white/5']">{{ team.initial }}</span>
                    <span class="truncate">{{ team.name }}</span>
                  </a>
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

      <div :class="['flex-1 overflow-hidden transition-[padding] duration-200', detailsOpen ? 'xl:pr-96' : '']">
        <Map ref="mapRef" @location-selected="onLocationSelected" />
      </div>
    </main>

  <aside
    v-show="detailsOpen"
    class="fixed inset-y-0 right-0 w-96 overflow-y-auto border-l border-gray-200 bg-white px-4 py-6 sm:px-6 lg:px-8 dark:border-white/10 dark:bg-gray-900"
  >
    <div class="flex items-start justify-between">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white">Location Analysis</h2>
      <button @click="closeDetails" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-white/10">
        <XMarkIcon class="size-5" />
        <span class="sr-only">Close panel</span>
      </button>
    </div>

    <div v-if="locationData" class="mt-6 space-y-6">
      <div v-if="locationData.loading" class="text-center py-8">
        <svg class="animate-spin h-8 w-8 text-indigo-600 dark:text-green-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-4 text-gray-500 dark:text-gray-400">Loading location data...</p>
      </div>

      <div v-else-if="locationData.error" class="text-center py-8 text-red-600 dark:text-red-400">
        <p>{{ locationData.error }}</p>
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

        <!-- Population Data -->
        <div v-if="locationData.populationData" class="mt-6">
          <div class="flex items-center gap-2 mb-3">
            <UserGroupIcon class="size-5 text-blue-600 dark:text-blue-400" />
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">State Demographics</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-blue-50 dark:bg-blue-900/20">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <UserGroupIcon class="size-4" />
                Population 21+
              </div>
              <div class="text-xl font-semibold text-blue-700 dark:text-blue-300">{{ locationData.populationData['pop21up (first)']?.toLocaleString() }}</div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-green-50 dark:bg-green-900/20">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <BeakerIcon class="size-4" />
                Per Capita (21+)
              </div>
              <div class="text-xl font-semibold text-green-700 dark:text-green-300">{{ locationData.populationData['gallons_eth / pop21up'] }}</div>
              <div class="text-xs text-gray-400">gallons/year</div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-purple-50 dark:bg-purple-900/20">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <ChartBarIcon class="size-4" />
                Total Ethanol
              </div>
              <div class="text-xl font-semibold text-purple-700 dark:text-purple-300">{{ locationData.populationData['Total gallons_eth']?.toLocaleString() }}</div>
              <div class="text-xs text-gray-400">gallons</div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-orange-50 dark:bg-orange-900/20">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <BeakerIcon class="size-4" />
                Total Beverage
              </div>
              <div class="text-xl font-semibold text-orange-700 dark:text-orange-300">{{ locationData.populationData['Total gallons_bev']?.toLocaleString() }}</div>
              <div class="text-xs text-gray-400">gallons</div>
            </div>
          </div>
        </div>

        <!-- Nearby Breweries -->
        <div v-if="locationData.nearbyBreweries && locationData.nearbyBreweries.length > 0" class="mt-6">
          <div class="flex items-center gap-2 mb-3">
            <MapPinIcon class="size-5 text-amber-600 dark:text-amber-400" />
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
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
        <div v-if="locationData.breweryAnalysis" class="mt-6">
          <div class="flex items-center gap-2 mb-3">
            <BuildingOfficeIcon class="size-5 text-green-600 dark:text-green-400" />
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Brewery Analysis</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-green-50 dark:bg-green-900/20">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <BeakerIcon class="size-4" />
                Total Beers
              </div>
              <div class="text-xl font-semibold text-green-700 dark:text-green-300">{{ locationData.breweryAnalysis.totalBeers }}</div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-yellow-50 dark:bg-yellow-900/20">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <ChartBarIcon class="size-4" />
                Avg ABV
              </div>
              <div class="text-xl font-semibold text-yellow-700 dark:text-yellow-300">{{ locationData.breweryAnalysis.avgAbv }}%</div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-red-50 dark:bg-red-900/20">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <ChartBarIcon class="size-4" />
                Avg IBU
              </div>
              <div class="text-xl font-semibold text-red-700 dark:text-red-300">{{ locationData.breweryAnalysis.avgIbu }}</div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-purple-50 dark:bg-purple-900/20">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <BeakerIcon class="size-4" />
                Unique Styles
              </div>
              <div class="text-xl font-semibold text-purple-700 dark:text-purple-300">{{ locationData.breweryAnalysis.uniqueStyles }}</div>
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
        <div v-if="locationData.beerStyleAnalysis && locationData.beerStyleAnalysis.length > 0" class="mt-6">
          <div class="flex items-center gap-2 mb-3">
            <BeakerIcon class="size-5 text-purple-600 dark:text-purple-400" />
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Beer Style Breakdown</h3>
          </div>
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
        <div v-if="locationData.marketAnalysis" class="mt-6">
          <div class="flex items-center gap-2 mb-3">
            <CurrencyDollarIcon class="size-5 text-indigo-600 dark:text-indigo-400" />
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Market Analysis</h3>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-indigo-50 dark:bg-indigo-900/20">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <UserGroupIcon class="size-4" />
                Market Saturation
              </div>
              <div class="text-xl font-semibold text-indigo-700 dark:text-indigo-300">{{ locationData.marketAnalysis.marketSaturation }}</div>
              <div class="text-xs text-gray-400">people per brewery</div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-emerald-50 dark:bg-emerald-900/20">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <BeakerIcon class="size-4" />
                Consumption per Capita
              </div>
              <div class="text-xl font-semibold text-emerald-700 dark:text-emerald-300">{{ locationData.marketAnalysis.consumptionPerCapita }}</div>
              <div class="text-xs text-gray-400">gallons/year</div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10" :class="{
              'bg-green-50 dark:bg-green-900/20': locationData.marketAnalysis.marketOpportunity === 'High',
              'bg-yellow-50 dark:bg-yellow-900/20': locationData.marketAnalysis.marketOpportunity === 'Medium',
              'bg-red-50 dark:bg-red-900/20': locationData.marketAnalysis.marketOpportunity === 'Low'
            }">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <ChartPieIcon class="size-4" />
                Market Opportunity
              </div>
              <div class="text-xl font-semibold" :class="{
                'text-green-700 dark:text-green-300': locationData.marketAnalysis.marketOpportunity === 'High',
                'text-yellow-700 dark:text-yellow-300': locationData.marketAnalysis.marketOpportunity === 'Medium',
                'text-red-700 dark:text-red-300': locationData.marketAnalysis.marketOpportunity === 'Low'
              }">{{ locationData.marketAnalysis.marketOpportunity }}</div>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-purple-50 dark:bg-purple-900/20">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <ChartBarIcon class="size-4" />
                Total Consumption
              </div>
              <div class="text-xl font-semibold text-purple-700 dark:text-purple-300">{{ locationData.marketAnalysis.totalConsumption?.toLocaleString() }}</div>
              <div class="text-xs text-gray-400">gallons ethanol</div>
            </div>
          </div>
        </div>

        <!-- Brewery Density -->
        <div v-if="locationData.breweryDensity" class="mt-6">
          <div class="flex items-center gap-2 mb-3">
            <ChartBarIcon class="size-5 text-cyan-600 dark:text-cyan-400" />
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Brewery Density</h3>
          </div>
          <div class="rounded-lg border border-gray-200 p-3 dark:border-white/10 bg-cyan-50 dark:bg-cyan-900/20">
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <MapPinIcon class="size-4" />
              Brewery Count
            </div>
            <div class="text-xl font-semibold text-cyan-700 dark:text-cyan-300">{{ locationData.breweryDensity.count }} breweries</div>
            <div class="text-xs text-gray-400">{{ locationData.breweryDensity.density.toFixed(4) }} per sq mile</div>
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
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  BeakerIcon,
  MapPinIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'

import Map from '@/components/Map.vue'
import BrewLogo from '@/assets/globe_logo.svg'
import { findStateForLocation } from '@/services/stateService'
import { findBreweriesNearLocation, getBreweryDensity, getNearestBreweries } from '@/services/breweryService'
import { getLatestStateData, getLatestStateDataRaw } from '@/services/populationService'
import { getBeersByBrewery } from '@/services/beerService'

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
  { name: 'Team', href: '#', icon: UsersIcon, current: false },
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
]
const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]

const sidebarOpen = ref(false)
const detailsOpen = ref(false)
const locationData = ref<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
const startupMessageDismissed = ref(false)

const mapRef = ref<InstanceType<typeof Map> | null>(null)

async function onLocationSelected(p: { lat: number; lng: number }) {
  detailsOpen.value = true

  locationData.value = { ...p, loading: true }

  await nextTick()
  mapRef.value?.resize()
  mapRef.value?.recenterOn(p.lat, p.lng)

  // Show radius circle to indicate search area
  mapRef.value?.showRadiusCircle(p.lat, p.lng, 50)

  try {
    const stateResult = await findStateForLocation(p.lng, p.lat)
    const nearbyBreweries = await findBreweriesNearLocation(p.lat, p.lng, 50)
    const breweryDensity = await getBreweryDensity(p.lat, p.lng, 50)

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
</script>
