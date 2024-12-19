export default {
  components: {
    SettingsCards: {
      AboutCard: {
        labels: {
          title: '关于',
          addInsInfo: '加载项信息',
        },
      },
      CompletionCard: {
        labels: {
          title: '补全',
          singleParagraph: '单段落补全',
        },
      },
      GeneralCard: {
        labels: {
          title: '通用',
          theme: '加载项主题',
        },
      },
    },
    ThemeButton: {
      labels: {
        toggleTheme: '切换主题',
      },
    },
  },
  layouts: {
    headers: {
      TaskpaneHeader: {
        routes: {
          dashboard: '仪表板',
          settings: '设置',
        },
      },
    },
  },
  pages: {
    taskpane: {
      DashboardPage: {},
      SettingsPage: {
        labels: {},
      },
    },
  },
}
