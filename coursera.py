import requests
from bs4 import BeautifulSoup
from flask import *
from flask_cors import CORS, cross_origin
import pandas as pd
import json
from textblob import TextBlob
# nltk.download('wordnet')
# nltk.download('all')


def sentiment_calc(text):
    try:
        if TextBlob(text).sentiment.polarity > 0:
            return "positive"
        elif TextBlob(text).sentiment.polarity < 0:
            return "negative"
        else:
            return "neutral"
    except:
        return None


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/search/', methods=['GET'])
@cross_origin()
def api_sentinet():
    URL = str(request.args.get('url'))
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    all_pages = soup.find_all('span', class_='_1lutnh9y')
    ending_page = all_pages[len(all_pages)-2].get_text()
    list_of_objects = []
    limit = 1
    for i in range(1, int(ending_page)+1):
        page = requests.get(URL + "?page=" + str(i))
        soup = BeautifulSoup(page.content, 'html.parser')
        reviews = soup.find_all('div', class_='review')
        for review in reviews:
            review_text = review.find(
                'div', class_='css-18w79dz').find('span').find('span').get_text()
            helpful = review.find('button', class_='review-helpful-button').find(
                'span', class_='cds-button-label').find_all('span')[1].get_text()
            try:
                helpful_num = int(helpful.split('(')[1].split(')')[0])
            except:
                helpful_num = 0
            stars = review.find('div', class_='_1mzojlvw').find_all(
                'span', class_='_13xsef79')
            rating = 0
            for star in stars:
                style = star.find('svg')['style'].split(';')[0]
                if (style.split('fill:')[1] == '#F2D049'):
                    rating = rating + 1
            o = [review_text, helpful_num, rating]
            list_of_objects.append(o)
        if (i == limit):
            break
    df = pd.DataFrame(list_of_objects, columns=[
                      'Review', 'Helpful For', 'Rating'])
    df['sentiment'] = df['Review'].apply(sentiment_calc)
    dataset = []

    for i in range(len(df.values)):
        row = {
            df.columns[0]: df.values[i][0],
            df.columns[1]: df.values[i][1],
            df.columns[2]: df.values[i][2],
            df.columns[3]: df.values[i][3]
        }
        dataset.append(row)
    dataset

    return json.dumps(dataset)


if (__name__ == '__main__'):
    app.run(port=7778)
