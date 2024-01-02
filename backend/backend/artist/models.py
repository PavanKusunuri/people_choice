from django.db import models
from artist_category.models import ArtistCategory

# Create your models here.
class Artist(models.Model):
    GENDER = {
        "M": "Male",
        "F": "Female",
        "T": "Transgender",
    }
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    current_location = models.CharField(max_length=100)
    place_of_birth = models.CharField(max_length=100)
    gender = models.CharField(max_length=1, choices=GENDER)
    artist_category = models.ForeignKey(ArtistCategory, on_delete = models.CASCADE)