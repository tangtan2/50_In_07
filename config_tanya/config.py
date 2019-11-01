class ScraperConfig:

    def __init__(self):
        self.baseurl = ''
        self.template = ''
        self.playertemplate = ''
        self.dest = ''
        self.playermetrics = ['standard', 'possession', 'miscellaneous', 'playoffs', 'other',
                              'similarity', 'penalty', 'goalie_advanced', 'hat_tricks', 'ot_goals']

    def setconfig(self, baseurl, date, extrametrics=''):
        self.baseurl = baseurl
        self.template = '/Users/tanyatang/Documents/Code/Python/50_In_07/data_tanya/templates/template_1.xlsx'
        self.playertemplate = '/Users/tanyatang/Documents/Code/Python/50_In_07/data_tanya/templates/template_2.xlsx'
        self.dest = '/Users/tanyatang/Documents/Code/Python/50_In_07/data_tanya/data_raw/' + date + '/'
        for metric in extrametrics:
            self.playermetrics.append(metric)
