class ScraperConfig:

    def __init__(self):
        self.script_name = ''
        self.baseurl = ''
        self.template = ''
        self.playertemplate = ''
        self.dest = ''
        self.playermetrics = ['standard', 'possession', 'miscellaneous', 'playoffs', 'other',
                              'similarity', 'penalty', 'goalie_advanced', 'hat_tricks', 'ot_goals']

    def setconfig(self, script_name, baseurl, date, extrametrics=''):
        self.script_name = script_name
        self.baseurl = baseurl
        self.template = '/Users/tanyatang/Documents/Code/Python/50_In_07/data_tanya/templates/template_1.xlsx'
        self.playertemplate = '/Users/tanyatang/Documents/Code/Python/50_In_07/data_tanya/templates/template_2.xlsx'
        self.dest = '/Users/tanyatang/Documents/Code/Python/50_In_07/data_tanya/data_raw/' + date + '/'
        for metric in extrametrics:
            self.playermetrics.append(metric)


class Config:

    def __init__(self):
        i = 0

    def setconfig(self):
        i = 0
