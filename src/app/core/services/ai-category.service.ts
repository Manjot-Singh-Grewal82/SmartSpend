import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AiCategoryService {

  // =========================
  // CATEGORY RULES
  // =========================

  private categoryRules: any = {

    // FOOD

    Food: [

      'pizza',
      'burger',
      'restaurant',
      'zomato',
      'swiggy',
      'food',
      'cafe',
      'coffee',
      'tea',
      'dominos',
      'kfc',
      'mcdonald'
    ],

    // TRANSPORT

    Transport: [

      'uber',
      'ola',
      'fuel',
      'petrol',
      'diesel',
      'taxi',
      'metro',
      'bus',
      'train',
      'flight'
    ],

    // SHOPPING

    Shopping: [

      'amazon',
      'flipkart',
      'shopping',
      'mall',
      'clothes',
      'shirt',
      'shoes'
    ],

    // ENTERTAINMENT

    Entertainment: [

      'netflix',
      'movie',
      'cinema',
      'spotify',
      'youtube',
      'game'
    ],

    // HEALTH

    Health: [

      'hospital',
      'medicine',
      'doctor',
      'gym',
      'health'
    ],

    // UTILITIES

    Utilities: [

      'electricity',
      'wifi',
      'internet',
      'water',
      'bill',
      'recharge'
    ]
  };

  // =========================
  // DETECT CATEGORY
  // =========================

  detectCategory(
    title: string
  ): string {

    if (!title) {

      return 'Others';
    }

    const lowerTitle =
      title.toLowerCase();

    for (
      const category
      in
      this.categoryRules
    ) {

      const keywords =

        this.categoryRules[category];

      const matched = keywords.some(

        (keyword: string) =>

          lowerTitle.includes(keyword)
      );

      if (matched) {

        return category;
      }
    }

    return 'Others';
  }
}