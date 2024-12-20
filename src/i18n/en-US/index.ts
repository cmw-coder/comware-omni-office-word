export default {
  components: {
    SettingsCards: {
      AboutCard: {
        labels: {
          title: 'About',
          environment: 'Environment',
          version: 'Version',
        },
      },
      CompletionCard: {
        labels: {
          title: 'Completion',
          singleParagraph: 'Single paragraph completion',
        },
      },
      GeneralCard: {
        labels: {
          title: 'General',
          theme: 'Add-ins Theme',
        },
      },
    },
    ThemeButton: {
      labels: {
        toggleTheme: 'Toggle Theme',
      },
    },
  },
  layouts: {
    headers: {
      TaskpaneHeader: {
        routes: {
          dashboard: 'Dashboard',
          settings: 'Settings',
        },
      },
    },
  },
  pages: {
    taskpane: {
      DashboardPage: {
        labels: {
          noNeedToComplete: 'No need to complete',
        },
      },
      SettingsPage: {
        labels: {},
      },
    },
  },
}
