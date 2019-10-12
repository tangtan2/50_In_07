from bs4 import BeautifulSoup
import urllib.request


def import_shortnames(config):
    teamnames = []
    url = config.baseurl + '/teams/'
    page = urllib.request.urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    franchisetable = soup.find('table', {'class': 'sortable stats_table'}, id='active_franchises')
    for row in franchisetable.findAll('tr'):
        columns = row.findAll('th')
        for item in columns:
            if item.find(text=True) and item['class'][0] == 'left':
                teamnames.append(item.find(href=True)['href'][-4:-1])
    return teamnames


def import_longnames(config):
    teamnames = []
    url = config.baseurl + '/teams/'
    page = urllib.request.urlopen(url)
    soup = BeautifulSoup(page, 'html.parser')
    franchisetable = soup.find('table', {'class': 'sortable stats_table'}, id='active_franchises')
    for row in franchisetable.findAll('tr'):
        columns = row.findAll('th')
        for item in columns:
            if item.find(text=True) and item['class'][0] == 'left':
                teamnames.append(item.find(text=True))
    return teamnames


def get_row_data(cells, columns):
    data = []
    if len(cells) == 0:
        for item in columns:
            data.append(item.find(text=True))
    elif len(columns) == 0:
        for item in cells:
            if item.find(text=True):
                data.append(item.find(text=True))
                if item.has_attr('colspan'):
                    for k in range(int(item.get('colspan', 1)) - 1):
                        data.append(item.find(text=True))
            else:
                data.append('')
                if item.has_attr('colspan'):
                    for k in range(int(item.get('colspan', 1)) - 1):
                        data.append('')
    elif len(columns) == 1:
        for item in columns:
            if item.find(text=True):
                data.append(item.find(text=True))
                if item.has_attr('colspan'):
                    for k in range(int(item.get('colspan', 1)) - 1):
                        data.append(item.find(text=True))
            else:
                data.append('')
                if item.has_attr('colspan'):
                    for k in range(int(item.get('colspan', 1)) - 1):
                        data.append('')
        for item in cells:
            if item.find(text=True):
                data.append(item.find(text=True))
                if item.has_attr('colspan'):
                    for k in range(int(item.get('colspan', 1)) - 1):
                        data.append(item.find(text=True))
            else:
                data.append('')
                if item.has_attr('colspan'):
                    for k in range(int(item.get('colspan', 1)) - 1):
                        data.append('')
    else:
        for item in cells:
            if item.find(text=True):
                data.append(item.find(text=True))
                if item.has_attr('colspan'):
                    for k in range(int(item.get('colspan', 1)) - 1):
                        data.append(item.find(text=True))
            else:
                data.append('')
                if item.has_attr('colspan'):
                    for k in range(int(item.get('colspan', 1)) - 1):
                        data.append('')
        for item in columns:
            if item.find(text=True):
                data.append(item.find(text=True))
                if item.has_attr('colspan'):
                    for k in range(int(item.get('colspan', 1)) - 1):
                        data.append(item.find(text=True))
            else:
                data.append('')
                if item.has_attr('colspan'):
                    for k in range(int(item.get('colspan', 1)) - 1):
                        data.append('')
    return data


def get_table_data(title, playersoup, comment):
    if title == 'standard':
        currentstandard = []
        standardtable = playersoup.find('table', {'class': 'row_summable sortable stats_table'},
                                        id='stats_basic_plus_nhl')
        for row in standardtable.findAll('tr'):
            cells = row.findAll('th')
            columns = row.findAll('td')
            currentstandard.append(get_row_data(cells, columns))
        return currentstandard
    else:
        currentdata = []
        soup = BeautifulSoup(comment, 'html.parser')
        for row in soup.findAll('tr'):
            cells = row.findAll('th')
            columns = row.findAll('td')
            currentdata.append(get_row_data(cells, columns))
        return currentdata
