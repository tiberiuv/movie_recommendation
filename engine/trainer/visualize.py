# import matplotlib as mpl
# mpl.use("TKAgg")

# import pandas as pd
# import matplotlib.pyplot as plt

def plot_movie_rating_frequency(ratings):
    # print(ratings.head(5), type(ratings))
    # counts = pd.DataFrame(ratings['movieId'].value_counts())
    # counts.columns = ['counts']
    # counts.sort_values(by=['counts'], ascending=False)
    # counts['movieId'] = ratings['movieId'].drop_duplicates()
    # print(ratings['movieId'].drop_duplicates().head(5))
    # print(counts.head(5), type(counts))
    # print(counts.describe())
    # # counts.top(10)
    counts = ratings.groupby('movieId').size()
    print(counts.head(10), type(counts))
    plt.figure()
    counts.plot(kind='hist', use_index=False)
    plt.show()
